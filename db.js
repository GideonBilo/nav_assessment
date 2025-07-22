const mysql = require("mysql2");

// Here I set up the database connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root", // Your MySQL username
  password: "Password", // Your MySQL password
  database: "nav_db" // This is the database I created
});

// Now I connect to MySQL and log the result
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database.");
});

// I export the connection so I can use it in other files
module.exports = connection;
