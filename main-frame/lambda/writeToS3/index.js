const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const s3 = new S3Client({});

exports.handler = async (event) => {
    var bucketName = process.env.BUCKET_NAME;
    var keyName = 'config.js';
    var apiUrl = process.env.API_URL;
    var content = `window.API_URL = '${apiUrl}'`;
    var params = { 'Bucket': bucketName, 'Key': keyName, 'Body': content };
    try {
        console.log('entrato')
        const data = await s3.send(new PutObjectCommand(params));
        console.log('content : ' + content)
        console.log("Successfully saved object to " + bucketName + "/" + keyName);
    } catch (err) {
            console.log(err);
    };
    const response = {
        statusCode: 200,
        body: JSON.stringify('good'),
    };
    return response;
};
