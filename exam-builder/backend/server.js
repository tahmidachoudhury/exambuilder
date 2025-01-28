const express = require("express")
const app = express()

// Middleware to parse JSON
app.use(express.json())

// Sample Route
app.get("/", (req, res) => {
  res.send("Welcome to my Node.js backend!")
})

// Start the server
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
