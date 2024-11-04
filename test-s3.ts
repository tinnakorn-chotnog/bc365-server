import {
    S3Client,
    ListBucketsCommand,
    ListObjectsV2Command,
    GetObjectCommand,
    PutObjectCommand,
    ListObjectsCommand
  } from "@aws-sdk/client-s3";
  import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
  
  const S3 = new S3Client({
    region: "auto",
    endpoint: `https://1686d1c3fc79dbc491e3e9d05b249d44.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: '1033ac03b959d982c9de7e4baabcef8c',
      secretAccessKey: '3c4ef41252271e83ba669c02b0c42aa7ff16ad327fd8e54884104e57d4263bf1',
    },
  });

  const input = { // ListObjectsRequest
    Bucket: "public", // required
    // Delimiter: "STRING_VALUE",
    // EncodingType: "url",
    // Marker: "STRING_VALUE",
    // MaxKeys: Number("int"),
    // Prefix: "STRING_VALUE",
    // RequestPayer: "requester",
    // ExpectedBucketOwner: "STRING_VALUE",
  };

  const command = new ListObjectsCommand(input);
  // const response = await client.send(command);
  
  S3.send(command).then( r => {
    console.log(r)
  })
  