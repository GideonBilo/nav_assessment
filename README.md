# nav_assessment
# The Catalyst Group NAV Consolidation System

## 📘 Overview

This is a simple yet powerful tool developed as part of a technical assessment for the role of **Senior Associate – Development** at The Catalyst Group.

The goal of the system is to:
- Allow Fund Administrators to easily upload Excel files containing NAV (Net Asset Value) data
- Store that data in a central MySQL database
- Present the data visually through interactive tables and charts

The app was built using beginner-friendly, open web technologies and focuses on simplicity and usability for both technical and non-technical users.

---

## 🛠 Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Database:** MySQL
- **Charts:** Chart.js (line and pie charts)
- **Excel Upload & Parsing:** Multer, `xlsx` package
- **Authentication:** express-session & bcrypt
- **Testing:** Mocha & Chai (basic unit test for date parsing)

---

## 💡 Features

- ✅ Excel file upload
- ✅ Converts Excel into database-friendly format
- ✅ Avoids duplicate entries by updating existing rows
- ✅ User login and registration (with session-based authentication)
- ✅ View NAV data in table (with pagination and in-table filtering)
- ✅ Line chart to compare NAV values over time
- ✅ Pie chart for quick NAV distribution view
- ✅ Upload new or view existing data with a single click
- ✅ Retains data between sessions (no need to re-upload)

---

## 🚀 How to Run It Locally

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/nav-assessment.git
cd nav-assessment
