import Footer from "@/components/footer"

import UserForm from "@/components/UserForm"

export default function CreateExamPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto py-10 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Create Maths Exam</h1>
        <UserForm />
      </div>
      <Footer />
    </div>
  )
}
