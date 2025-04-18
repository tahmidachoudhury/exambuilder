"use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { useToast } from "@/hooks/use-toast"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { registerUser } from "@/lib/firebase/auth"
// import * as z from "zod"
import Link from "next/link"

// const formSchema = z.object({
//   email: z.string().email({
//     message: "Please enter a valid email address.",
//   }),
//   password: z.string().min(8, {
//     message: "Password must be at least 8 characters.",
//   }),
// })

export function RegisterForm() {
  //   const router = useRouter()
  //   const { toast } = useToast()
  //   const [isLoading, setIsLoading] = useState(false)
  //   const [email, setEmail] = useState("")
  //   const [password, setPassword] = useState("")
  //const [error, setError] = useState<string | null>(null)

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault()
  //     setIsLoading(true)
  //     //setError(null)

  //     const { user, error } = await registerUser(email, password)

  //     if (error) {
  //       //Check the issue with the sign in
  //       //setError((error as Error).message)
  //       toast({
  //         title: "Uh oh! Something went wrong.",
  //         description: (error as Error).message,
  //       })

  //       return
  //     }

  //     setIsLoading(false)
  //     toast({
  //       title: "Registration successful 🥳",
  //       description: "Your account has been created",
  //     })
  //     if (user) {
  //       router.push("/login")
  //     }
  //   }

  //   const form = useForm<z.infer<typeof formSchema>>({
  //     resolver: zodResolver(formSchema),
  //     defaultValues: {
  //       email: "",
  //       password: "",
  //     },
  //   })

  //   return (
  //     <Form {...form}>
  //       <form onSubmit={handleSubmit} className="space-y-4">
  //         <FormField
  //           control={form.control}
  //           name="email"
  //           render={({ field }) => (
  //             <FormItem>
  //               <FormLabel>Email</FormLabel>
  //               <FormControl>
  //                 <Input
  //                   placeholder="m@example.com"
  //                   onChange={(e) => setEmail(e.target.value)}
  //                 />
  //               </FormControl>
  //               <FormMessage />
  //             </FormItem>
  //           )}
  //         />
  //         <FormField
  //           control={form.control}
  //           name="password"
  //           render={({ field }) => (
  //             <FormItem>
  //               <FormLabel>Password</FormLabel>
  //               <FormControl>
  //                 <Input
  //                   type="password"
  //                   placeholder="••••••••"
  //                   onChange={(e) => setPassword(e.target.value)}
  //                 />
  //               </FormControl>
  //               <FormMessage />
  //             </FormItem>
  //           )}
  //         />

  //         <Button type="submit" className="w-full" disabled={isLoading}>
  //           {isLoading ? "Creating account..." : "Create account"}
  //         </Button>
  //       </form>
  //     </Form>
  //   )
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Registration Closed</h1>
        <p className="text-center">
          New user registration is currently disabled. Please contact the
          administrator for access.
        </p>
        {/* Link back to login */}
        <div className="text-center mt-4">
          <Link href="/login" className="text-blue-600 hover:underline">
            Return to login
          </Link>
        </div>
      </div>
    </div>
  )
}
