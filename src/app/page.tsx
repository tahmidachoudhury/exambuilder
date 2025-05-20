import ExamBuilder from "@/components/ExamBuilder"
// import UserForm from "@/components/UserForm"

export default function CreateExamPage() {
  return (
    // <div className="min-h-screen flex flex-col">
    //   <div className="container mx-auto py-10 flex-grow">
    //     <UserForm />
    //   </div>
    // </div>
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Maths Exam Builder</h1>
      <ExamBuilder />
    </main>
  )
}
