const { Web3Storage, getFilesFromPath } = require("web3.storage")
const express  = require("express")
// express app
const app = express();
// app listen to the port
app.listen(3000);
app.use(express.json()) 
 
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
        console.log(req.body.file_path)
        file_cid = await storeFiles(req.body.file_path)
        return await res.json({data: file_cid})
    }
    catch(error){
        console.error(error);
        return res.json({message: "problem uploading file!"});
    }
});



 

