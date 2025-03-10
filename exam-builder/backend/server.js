const express = require("express")
const latex = require("node-latex")
const fs = require("fs")
const path = require("path")
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

app.post("/api/generate-exam", async (req, res) => {
  try {
    // const { questions, examTitle, examDate } = req.body
    console.log("Generating new PDF at:", Date.now())
    // // 1. Load your LaTeX template
    let templateContent = fs.readFileSync(
      path.join(__dirname, "templates/exam-template.tex"),
      "utf8"
    )

    console.log("Template content:", templateContent.substring(0, 100))

    // // 2. Replace placeholders with actual data
    // templateContent = templateContent
    //   .replace("EXAM_TITLE", examTitle)
    //   .replace("EXAM_DATE", examDate)

    // // 3. Generate question content based on your template format
    // // This will depend on your specific GCSE math format
    // const questionsContent = generateQuestionsContent(questions)
    // templateContent = templateContent.replace(
    //   "QUESTIONS_PLACEHOLDER",
    //   questionsContent
    // )

    // 4. Compile LaTeX to PDF
    const timestamp = Date.now()
    const outputPath = `exam-${timestamp}.pdf`
    const output = fs.createWriteStream(outputPath)
    console.log("Creating PDF with path:", outputPath)

    const pdf = latex(templateContent)

    pdf.pipe(output)

    output.on("finish", () => {
      // 5. Send the PDF file
      res.download(outputPath, "exam.pdf", (error) => {
        console.log("File sent to client, cleaning up...")
        fs.unlink(outputPath, (unlinkError) => {
          if (unlinkError) console.error("Error deleting file:", unlinkError)
          else console.log("Cleanup completed successfully")
        })
      })
    })
  } catch (error) {
    console.error("Error generating exam:", error)
    res.status(500).send("Error generating exam PDF")
  }
})

// Start the server
const PORT = 3002
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
