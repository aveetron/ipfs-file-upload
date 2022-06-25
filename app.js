const { Web3Storage, getFilesFromPath } = require("web3.storage");
const express  = require("express");
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const formidableMiddleware = require('express-formidable');

// express app
const app = express();
// app listen to the port
app.listen(3000);
app.use(express.json());
app.use(formidableMiddleware());
 
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDkyMzBhNzkxQzdiZGRjQzY2MTE2YjA2MTQyMDcyN0I3ODkwNUFEZWYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTQ2ODI2MDc3ODgsIm5hbWUiOiJXZWIzU3RvcmFnZVRlc3RUb2tlbiJ9.syIzUc0ODASclopx0AnnFuGd-Jbl7HNHtjChFjQTRBc"
const client = new Web3Storage({ token })
 
async function storeFiles (file_path) {
    const files = await getFilesFromPath(file_path)
    console.log(files)
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
        console.log(req.files)
        file_cid = await storeFiles([req.files.files.path])
        file_path = req.files.files.path
        return await res.json({
            file_cid: file_cid,
            file_name: req.files.files.name,
            file_type: req.files.files.type,
            file_size: req.files.files.size,
            file_source: "http://"+file_cid+".ipfs.dweb.link"+file_path.replace("/tmp", "")
        })
    }
    catch(error){
        console.error(error);
        return res.json({message: "problem uploading file!"});
    }
});

 

