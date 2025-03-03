import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <h1 className="text-4xl font-bold text-white mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-white mb-8">Sorry, the page you are looking for does not exist.</p>
      <Link href="/dashboard" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
        Return to Dashboard
      </Link>
    </div>
  )
}