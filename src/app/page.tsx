import Footer from "@/components/footer"

import UserForm from "@/components/UserForm"

export default function CreateExamPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto py-10 flex-grow">
        <UserForm />
      </div>
    </div>
  )
}
