const express = require("express")
const latex = require("node-latex")
const fs = require("fs")
const path = require("path")
const app = express()
const { generateQuestions } = require("./services/openai")
const { generateExam } = require("./services/latex")

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
    console.log("Generating new PDF at:", Date.now())

    // Example question for MVP
    const questions = [
      {
        content: `\\[f(x) = (x + 3)(x + 2)(x - 1)\\] 

\\begin{enumerate}[label=(\\alph*)]
\\item Sketch the curve \\( y = f(x) \\), showing the points of intersection with the coordinate axes. \\hfill \\textbf{(3)}
\\item Showing the coordinates of the points of intersection with the coordinate axes, sketch on separate diagrams the curves:
    \\begin{enumerate}[label=(\\roman*)]
    \\item \\( y = f(x - 3) \\) \\hfill \\textbf{(2)}
    \\item \\( y = f(-x) \\) \\hfill \\textbf{(2)}
    \\end{enumerate}
\\end{enumerate}

\\vspace{8cm}`,
        totalMarks: 7,
      },
      {
        content:
          "$a$ is directly proportional to $b$.\n\nWhen $a = 7$, $b = 28$.\n\nFind the value of $b$ when $a = 5$.\n\n\\vspace{8cm}",
        totalMarks: 3,
      },
    ]

    // Generate LaTeX content
    const latexContent = generateExam(questions)

    // Create a temporary file for the LaTeX content
    const timestamp = Date.now()
    const tempLatexPath = path.join(__dirname, `temp-${timestamp}.tex`)
    fs.writeFileSync(tempLatexPath, latexContent)

    // Generate PDF
    const outputPath = path.join(__dirname, `exam-${timestamp}.pdf`)
    const output = fs.createWriteStream(outputPath)
    const pdf = latex(fs.createReadStream(tempLatexPath))

    pdf.pipe(output)

    output.on("finish", () => {
      // Clean up temporary LaTeX file
      fs.unlinkSync(tempLatexPath)

      // Send the PDF file
      res.download(outputPath, "exam.pdf", (error) => {
        if (error) {
          console.error("Error sending file:", error)
          return res.status(500).send("Error sending PDF")
        }
        // Clean up PDF file after sending
        fs.unlink(outputPath, (unlinkError) => {
          if (unlinkError)
            console.error("Error deleting PDF file:", unlinkError)
        })
      })
    })

    pdf.on("error", (error) => {
      console.error("Error generating PDF:", error)
      // Clean up temporary LaTeX file
      fs.unlinkSync(tempLatexPath)
      res.status(500).send("Error generating PDF")
    })
  } catch (error) {
    console.error("Error generating exam:", error)
    res.status(500).send("Error generating exam PDF")
  }
})

// Start the server
const port = process.env.PORT || 3002
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
