const express = require("express")
const app = express()
const { generateQuestions } = require("./services/openai")

// Middleware to parse JSON
app.use(express.json())

const cors = require("cors")
app.use(cors())

app.get("/", (req, res) => {
  res.send("Welcome to my Node.js backend!")
})

// Sample Route
app.post("/api/test", async (req, res) => {
  try {
    // Access the payload from req.body
    const payload = req.body

    // Simulate saving the item (in real use case, you'd save it to a database)
    console.log("Received payload:", payload)

    // Generate questions first
    const response = await generateQuestions(payload)

    // Send single response with both the success message and generated questions
    res.status(201).json({
      message: "Item created successfully",
      item: payload,
      questions: response,
    })
  } catch (error) {
    // Add error handling
    console.error("Error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Start the server
const PORT = 3002
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
