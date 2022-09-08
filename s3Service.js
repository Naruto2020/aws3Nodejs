const {S3 } = require("aws-sdk");
//const { param } = require("express/lib/request");
var {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');
const uuid = require("uuid").v4;

// s3 v2
exports.s3uploadv2 = async (files) =>{
    const s3 = new S3();
    // upload just one file 

    // const param = {
    //     Bucket: process.env.AWS_BUCKET_NAME,
    //     Key: `uploads/${uuid()}-${file.originalname}`,
    //     //Secret_key: process.env.AWS_SECRET_ACCESS_KEY,
    //     Body: file.buffer
    // }

    //console.log('clé : ', param);
    //return await s3.upload(param).promise();

    // upload more than one files 

    const params = files.map(file =>{
        return {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `uploads/${uuid()}-${file.originalname}`,
            //Secret_key: process.env.AWS_SECRET_ACCESS_KEY,
            Body: file.buffer
        }
    });

    return await Promise.all(
        params.map(param => s3.upload(param).promise())
    );
    
};

// s3 v3
exports.s3uploadv3 = async (files) =>{
    const s3client = new S3Client();

    // upload one file on v3

    // const param  = {
    //     Bucket: process.env.AWS_BUCKET_NAME,
    //     Key: `uploads/${uuid()}-${file.originalname}`,
    //     //Secret_key: process.env.AWS_SECRET_ACCESS_KEY,
    //     Body: file.buffer
    // };

    // return s3client.send(new PutObjectCommand(param))

    // upload many files on v3

    const params = files.map(file =>{
        return {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `uploads/${uuid()}-${file.originalname}`,
            //Secret_key: process.env.AWS_SECRET_ACCESS_KEY,
            Body: file.buffer
        }
    });

    return await Promise.all(
        params.map(param => s3client.send(new PutObjectCommand(param)))
    );
};