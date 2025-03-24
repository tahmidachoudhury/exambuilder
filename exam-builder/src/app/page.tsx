import GenerateLatexExam from "@/components/GenerateLatexExam"
import UserForm from "@/components/UserForm"

export default function CreateExamPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Create Maths Exam</h1>
      <UserForm />
      {/* <GenerateLatexExam /> */}
    </div>
  )
}
