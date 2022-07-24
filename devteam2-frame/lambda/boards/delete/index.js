var AWS = require("aws-sdk");
var mysql = require("mysql2/promise");
var headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization,access-token"
};

exports.handler = async (event) => {
  console.log('starting query');
  const itemId = event.pathParameters.id;

  console.log('item : ' + itemId);
  
  const secretsManager = new AWS.SecretsManager({
    region: "ap-northeast-2"
  });
  // secret manager
  const response = await secretsManager.getSecretValue({
    SecretId: process.env.RDS_SECRET_NAME
  }).promise();

  const { host, username, password } = JSON.parse(response.SecretString);
  
  const sql = 'DELETE FROM BOARD WHERE ID = ?;';

  console.log(sql);
  
  const connection = await mysql.createConnection({
    host: process.env.PROXY_ENDPOINT,
    user: username,
    password,
    database: process.env.DB_NAME
  });

  const result = await connection.execute(sql, [itemId]);
  console.log(result[0].affectedRows);
  const ret = result[0].affectedRows;

  if(ret > 0) {
    return {
      statusCode: 200,
      headers,
      body: 'Success'
    };
  } else {
    return {
      statusCode: 404,
      headers,
      body: 'Fail'
    }
  }
};
