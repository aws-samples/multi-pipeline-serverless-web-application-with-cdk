const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");
var mysql = require("mysql2/promise");
var headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization,access-token"
};

exports.handler = async (event) => {
  console.log('starting query');

  const secretsManager = new SecretsManagerClient({});
  // secret manager
  const response = await secretsManager.send(new GetSecretValueCommand({
    SecretId: process.env.RDS_SECRET_NAME
  }));

  const { host, username, password } = JSON.parse(response.SecretString);

  const sql = 'SELECT * from BOARD;';

  console.log(sql);

  const connection = await mysql.createConnection({
    host: process.env.PROXY_ENDPOINT,
    user: username,
    password,
    database: process.env.DB_NAME
  });

  const [rows, fields] = await connection.execute(sql);

  console.log([rows]);
  console.log(JSON.stringify([rows]));

  if([rows] != null) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify([rows])
    };
  } else {
    return {
      statusCode: 404,
      headers,
      body: 'Error'
    };
  }
};
