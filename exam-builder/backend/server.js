const express = require("express")
const app = express()

// Middleware to parse JSON
app.use(express.json())

const cors = require("cors")
app.use(cors())

// Sample Route
app.post("/api/test", (req, res) => {
  // Access the payload from req.body
  const newItem = req.body

  // Simulate saving the item (in real use case, you'd save it to a database)
  console.log("Received payload:", newItem)

  // Respond with a success message
  res.status(201).json({
    message: "Item created successfully",
    item: newItem,
  })
})

// Start the server
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
