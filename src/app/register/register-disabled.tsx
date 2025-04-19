import { Button } from "@/components/ui/button"
import Link from "next/link"

export function DisableRegister() {
  return (
    <div>
      <div className="w-full max-w-md space-y-3">
        <p className="text-center font-bold">
          New user registration is currently disabled. Please contact the
          administrator for access.
        </p>
        {/* Link back to login */}
        <div className="text-center mt-4">
          <Link href="/login">
            <Button type="submit" className="w-full">
              Return to login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
