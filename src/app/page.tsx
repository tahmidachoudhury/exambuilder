import Footer from "@/components/footer"

import UserForm from "@/components/UserForm"
import { GalleryVerticalEnd } from "lucide-react"

export default function CreateExamPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto py-10 flex-grow">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 font-medium">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-6" />
          </div>
          Maths Exam Builder.
        </h1>
        <UserForm />
      </div>
      <Footer />
    </div>
  )
}
