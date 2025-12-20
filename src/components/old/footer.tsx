import Image from "next/image"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full container mx-auto border-t border-gray-200 py-8 flex flex-col items-center justify-center gap-4">
      <div className="w-full">
        {/* The tacknowledge tag */}
        <div className="bg-[#1a3047] text-white rounded-md flex gap-2 w-fit	">
          <a
            href="https://tacknowledge.co.uk"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex items-center">
              <div className="px-2 py-2 border-r border-gray-500">
                {/* Tacknowledge SVG Logo */}
                <Image
                  src="/tacknowledge.svg"
                  alt="tacknowledge logo"
                  width={25}
                  height={25}
                />
              </div>

              <span className="text-sm px-2">
                Powered by <b>Tacknowledge</b>{" "}
              </span>
            </div>
          </a>
        </div>
      </div>

      {/* Copyright and disclaimer */}
      <div className="text-center text-sm text-primary-foreground">
        Copyright Tacknowledge © {currentYear}. The questions are modeled after
        past exam papers and are intended for practice purposes only. They may
        not appear in your actual exam.
      </div>
    </footer>
  )
}
