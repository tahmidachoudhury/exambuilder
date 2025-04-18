// import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { RegisterForm } from "./register-form"
import { GalleryVerticalEnd } from "lucide-react"

// export const metadata: Metadata = {
//   title: "Register - Mednotate",
//   description: "Create a Mednotate account",
// }

export default function RegisterPage() {
  return (
    <div className="container relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-teal-900">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            width={1920}
            height={1080}
            alt="Authentication background"
            className="h-full w-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Maths Exam Builder.
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          {/* <blockquote className="space-y-2">
            <p className="text-lg">
              "Mednotate has transformed my practice. I can focus on my patients
              while the app handles documentation accurately and efficiently."
            </p>
            <footer className="text-sm">Dr. Sarah Johnson</footer>
          </blockquote> */}
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your information to create your account
            </p>
          </div>
          <RegisterForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
