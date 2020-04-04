const sql = require("mssql");

const config = {
  user: "sa",
  password: "123Password",
  server: "localhost",
  database: "TaskManagement",
  options: {
    encrypt: true,
    enableArithAbort: true
  }
};

const connectToServer = async function connectToServer() {
  try {
    await sql.connect(config);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectToServer;
