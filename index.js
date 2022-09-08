const express =  require('express');
require("dotenv").config();
const multer =  require("multer");
const { s3uploadv2, s3uploadv3  } = require('./s3Service');
const uuid = require("uuid").v4;

const app =  express();

// const upload = multer({dest: "uploads/"});

// for single file upload

// app.post("/upload", upload.single("file"), (req, res) =>{
//     res.json({status : "success"});
// });


// for multiple file upload

// app.post("/upload", upload.array("file", 2), (req, res) =>{
//     res.json({status : "success"});
// });

// for multiple fields upload 

// const multiUpload = upload.fields([
//     {name: "avatar", maxCount : 1},
//     {name: "resume", maxCount : 1},
// ]);

// app.post("/upload", multiUpload, (req, res) =>{
//     console.log("fichier : ", req.files);
//     res.json({status : "success"});
// });

// custom filename 

// const storage = multer.diskStorage({
//     destination: (req, res, cb) =>{
//         cb(null, "uploads");
//     },
//     filename: (req, file, cb) =>{
//         const {originalname} = file;
//         cb(null, `${uuid()}-${originalname}`);
//     }
// })

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) =>{
    console.log("c quoi ? : ", file.mimetype.split("/")[1])
    if(file.mimetype.split("/")[1] === 'jpeg' || file.mimetype.split("/")[1] === 'png'){
        cb(null, true);

    } else{
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
    }
};

const upload = multer({storage, fileFilter, limits : {fieldSize: 1000000, files: 2}});

// s3 v2
// app.post("/upload", upload.array("file"), async (req, res) =>{
//     //const file = req.files[0];
//     //console.log("myfiles : ", req.files);
//     try{
//         const results = await s3uploadv2(req.files)
//         console.log("results : ", results);
//         return res.json({status : "success", results});
//     } catch(err){
//         console.log(err);
//     }

// });


// s3 v3
app.post("/upload", upload.array("file"), async (req, res) =>{
    //const file = req.files[0];
    //console.log("myfiles : ", req.files);


    try{
        const results = await s3uploadv3(req.files)
        console.log("results : ", results);
        return res.json({status : "success", results});
    } catch(err){
        console.log(err);
    }

});

app.use((error, req, res, next) =>{
    if(error instanceof multer.MulterError){
        if(error.code === "LIMIT_FILE_SIZE"){
            res.status(400).json({ 
                message: "file is too large",
            })
        }

        if(error.code === "LIMIT_FILE_COUNT"){
            res.status(400).json({
                message: "file limit reached",
            });
        }

        if(error.code === "LIMIT_UNEXPECTED_FILE"){
            return res.status(400).json({
                message: "file must be an image",
            });
        }
    }
});

app.listen(4000, () =>{ console.log("listenig on port 4000")});