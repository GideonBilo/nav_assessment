// Here I import all the packages I need
const express = require("express");
const multer = require("multer");
const path = require("path");
const xlsx = require("xlsx");
const db = require("./db"); // This is my database connection
const session = require("express-session");
const bodyParser = require("body-parser");

// I create the express app
const app = express();
const PORT = 3000; // I set the port here

app.use(express.static(path.join(__dirname)));
// Middleware 
// This part here lets me read form data from POST requests
app.use(bodyParser.urlencoded({ extended: true }));

// Here I set up sessions to track logged-in users
app.use(session({
  secret: "verysecretkey", // In production this should be stronger
  resave: false,
  saveUninitialized: true
}));

// Authentication
// This function checks if a user is logged in before accessing certain pages
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/login.html");
  }
  next();
}

// Routes 

// Here I handle user registration
app.post("/register", (req, res) => {
  const { name, surname, email, password } = req.body;

  const sql = `INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)`;

  db.query(sql, [name, surname, email, password], (err, result) => {
    if (err) {
      console.error("Error registering user:", err);
      return res.status(500).send("Error registering user.");
    }
    res.redirect("/login.html"); // After registering, go to login page
  });
});

// Here is the login logic
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = `SELECT * FROM users WHERE email = ? LIMIT 1`;
  db.query(sql, [username], (err, results) => {
    if (err) {
      console.error("Login error:", err);
      return res.status(500).send("Internal server error.");
    }

    if (results.length === 0) {
      return res.status(401).send("Invalid username or password");
    }

    const user = results[0];
    // I check if the password is correct
    if (user.password !== password) {
      return res.status(401).send("Invalid username or password");
    }

    req.session.userId = user.id; // Save user ID in the session
    res.redirect("/"); // Go to homepage
  });
});

// Protected home page
app.get("/", requireLogin, (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Logout logic
app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Error logging out:", err);
    }
    res.redirect("/login.html");
  });
});

// File Upload Logic
// I use multer to save uploaded Excel files
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage: storage });

// This is the upload route — it reads Excel and saves the data to MySQL
app.post("/upload", requireLogin, upload.single("excelFile"), (req, res) => {
  const filePath = req.file.path;

  // I use xlsx to read the uploaded Excel file
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const jsonData = xlsx.utils.sheet_to_json(sheet);

  // For each row, I save the data to the database
  jsonData.forEach(row => {
  const { Company, Fund, "NAV Date": navDate, "Nav Value": navValue } = row;

  const sql = `
    INSERT INTO nav_data (company, fund, nav_date, nav_value)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE nav_value = VALUES(nav_value)
  `;

  db.query(sql, [Company, Fund, formatDate(navDate), navValue], (err, result) => {
    if (err) {
      console.error("Error inserting/updating row:", err);
    }
  });
});


app.get("/data", (req, res) => {
  db.query("SELECT * FROM nav_data", (err, results) => {
    if (err) {
      return res.status(500).send("Error fetching data");
    }

    // Map and reformat each row
    const formatted = results.map(row => ({
      Company: row.company,
      Fund: row.fund,
      "NAV Date": formatDateBack(row.nav_date),
      "Nav Value": parseFloat(row.nav_value)
    }));

    res.json(formatted);
  });
});

// Format date from yyyy-mm-dd → dd/mm/yyyy
function formatDateBack(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}



  res.json(jsonData); // I send the data back to the frontend for display
});

// This function helps format the date properly
const { formatDate } = require("./utils");

app.use(express.static("public"));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

