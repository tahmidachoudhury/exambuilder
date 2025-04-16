const express = require("express")
const latex = require("node-latex")
const fs = require("fs")
const path = require("path")
const app = express()
const tempQuestions = require("./data/questions.json")
//const { generateQuestions } = require("./services/openai")
const { generateExam } = require("./services/QPLatexGenerator")

// Middleware to parse JSON
app.use(express.json())

const cors = require("cors")
const archiver = require("archiver")
const { generateMarkscheme } = require("./services/MSLatexGenerator")
app.use(cors())

app.get("/", (req, res) => {
  res.send("Welcome to my Node.js backend!")
})

// Sample Route
app.get("/api/test", async (req, res) => {
  try {
    // Send single response with both the success message and json questions
    res.status(201).json({
      message: "Item created successfully",
      tempQuestions,
    })
  } catch (error) {
    // Add error handling
    console.error("Error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.post("/api/generate-exam", async (req, res) => {
  try {
    const questions = req.body
    const timestamp = Date.now()
    const tempDir = path.join(__dirname, `temp-${timestamp}`)
    fs.mkdirSync(tempDir)

    // --- Step 1: Generate LaTeX content ---
    const examLatex = generateExam(questions) // You already have this
    const markschemeLatex = generateMarkscheme(questions) // You'll need to create this function

    const examTexPath = path.join(tempDir, "exam.tex")
    const markschemeTexPath = path.join(tempDir, "markscheme.tex")

    fs.writeFileSync(examTexPath, examLatex)
    fs.writeFileSync(markschemeTexPath, markschemeLatex)

    // --- Step 2: Compile LaTeX to PDF ---
    const examPdfPath = path.join(tempDir, "exam.pdf")
    const markschemePdfPath = path.join(tempDir, "markscheme.pdf")

    await Promise.all([
      compileLatexToPdf(examTexPath, examPdfPath),
      compileLatexToPdf(markschemeTexPath, markschemePdfPath),
    ])

    // --- Step 3: Create ZIP file ---
    res.setHeader("Content-Type", "application/zip")
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="exam-files-${timestamp}.zip"`
    )

    const archive = archiver("zip")
    archive.pipe(res)

    archive.file(examPdfPath, { name: "exam.pdf" })
    archive.file(markschemePdfPath, { name: "markscheme.pdf" })

    archive.finalize()

    // --- Step 4: Cleanup after download finishes ---
    res.on("finish", () => {
      fs.rm(tempDir, { recursive: true, force: true }, (err) => {
        if (err) console.error("Cleanup error:", err)
      })
    })
  } catch (error) {
    console.error("Error generating exam zip:", error)
    res.status(500).send("Failed to generate ZIP file.")
  }
})

// Helper function to compile LaTeX to PDF
function compileLatexToPdf(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const input = fs.createReadStream(inputPath)
    const output = fs.createWriteStream(outputPath)
    const pdf = latex(input)

    pdf.pipe(output)
    pdf.on("error", reject)
    output.on("finish", resolve)
  })
}

// Start the server
const port = process.env.PORT || 3002
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`)
})
