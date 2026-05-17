# Smart Hostel & Mess Management System

A browser-based prototype for managing hostel and mess operations.

## Features

- QR-based meal attendance
- Mess feedback sentiment analysis
- Complaint ticket system
- Visitor management
- Room allocation optimization
- Dashboard metrics for hostel staff

## Run the Project

You can run this project in either of these ways.

### Option 1: Open Directly

Download or clone the repository, then open `index.html` in any modern browser.

### Option 2: Run with npm

Install Node.js, then run:

```bash
npm start
```

Open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Clone from GitHub

```bash
git clone https://github.com/SourjadeepNath/smart-hostel-mess-management-system.git
cd smart-hostel-mess-management-system
npm start
```

## Project Structure

```text
index.html   Main application layout
styles.css   Application styling
app.js       Application logic and sample data
server.js    Local static server for npm start
```

## Notes

This is a frontend prototype. The data is stored in browser memory while the page is open, so refreshing the page resets sample attendance, feedback, complaint, visitor, and room allocation data.
