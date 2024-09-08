import Link from "next/link"

export default function GenerateTokenPage() {
  return (
    <main className="w-full max-w-lg mx-auto my-8 flex flex-col gap-4">
      <Link
        href="/api/token"
        className="flex items-center justify-center p-2 rounded-md bg-red-600 hover:bg-red-700"
      >
        Generate token
      </Link>
    </main>
  )
}
