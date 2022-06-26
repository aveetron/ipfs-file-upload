const { Web3Storage, getFilesFromPath } = require("web3.storage");
const express  = require("express");
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const formidableMiddleware = require('express-formidable');
const { intersection } = require("lodash");

// express app
const app = express();
// app listen to the port
app.listen(3000);
app.use(express.json());

app.use(formidableMiddleware({
    encoding: 'utf-8',
    multiples: true, // req.files to be arrays of files
}));
 
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDkyMzBhNzkxQzdiZGRjQzY2MTE2YjA2MTQyMDcyN0I3ODkwNUFEZWYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTQ2ODI2MDc3ODgsIm5hbWUiOiJXZWIzU3RvcmFnZVRlc3RUb2tlbiJ9.syIzUc0ODASclopx0AnnFuGd-Jbl7HNHtjChFjQTRBc"
const client = new Web3Storage({ token })
 
async function storeFiles (file_path) {
    const files = await getFilesFromPath(file_path)
    const cid = await client.put(files)
    console.log(cid)
    return cid
}

app.post("/api/v1/file/upload/",async (req, res, next) => {
    try{
        console.log("got file")
        console.log(req.body.file_path)
        
        file_cid = await storeFiles(req.body.file_path)
        return await res.json({data: file_cid})
    }
    catch(error){
        console.error(error);
        return res.json({message: "problem uploading file!"});
    }
});


app.post("/api/v1/document/upload/",async (req, res) => {
    try{
        console.log("got file")
        console.log(req.body.name)
        file_path_list = []
        get_file_obj = req.files
        total_size_of_folder = 0
        for(let i=0;i<req.files.files.length;i++){
            file_path_list.push(get_file_obj.files[i].path)
            total_size_of_folder = total_size_of_folder + parseInt(get_file_obj.files[i].size)
        }

        if(file_path_list.length == 0){
            console.log("bangladesh")
            file_path = req.files.files.path
            file_cid = await storeFiles(get_file_obj.files.path)
            return await res.json({
                file_cid: file_cid,
                file_name: req.files.files.name,
                file_type: req.files.files.type,
                is_file: true,
                file_size: req.files.files.size,
                file_source: "http://"+file_cid+".ipfs.dweb.link"+file_path.replace("/tmp", "")
            })
        }
        else{
            console.log("total list", file_path_list)
            file_cid = await storeFiles(file_path_list)
            return await res.json({
                folder_cid: file_cid,
                folder_name: req.fields.name,
                is_file: false,
                folder_size: total_size_of_folder,
                folder_source: "Http://ipfs.io/ipfs/"+file_cid
            })
        }
    }
    catch(error){
        console.error(error);
        return res.json({message: "problem uploading file!"});
    }
});

 
app.post("/api/v1/folder/upload/",async (req, res) => {
    try{
        console.log("folder upload")
        // file_cid = await storeFiles([req.files.files.path])
        // file_path = req.files.files.path
        // return await res.json({
        //     file_cid: file_cid,
        //     file_name: req.files.files.name,
        //     file_type: req.files.files.type,
        //     file_size: req.files.files.size,
        //     file_source: "http://"+file_cid+".ipfs.dweb.link"+file_path.replace("/tmp", "")
        // })
    }
    catch(error){
        console.error(error);
        return res.json({message: "problem uploading file!"});
    }
});
