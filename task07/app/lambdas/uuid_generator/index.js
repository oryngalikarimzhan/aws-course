const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({ region: process.env.region });
const bucketName = process.env.target_bucket;

exports.handler = async (event) => {
  console.log('EVENT =>', event);
  try {
    const fileName = new Date().toISOString();
    const ids = Array.from({ length: 10 }, () => crypto.randomUUID());
    const fileContent = JSON.stringify({ ids });

    const putObjectParams = {
      Bucket: bucketName,
      Key: fileName,
      Body: fileContent,
      ContentType: 'application/json',
    };

    await s3Client.send(new PutObjectCommand(putObjectParams));
  } catch (error) {
    console.log(error);
  }
};
