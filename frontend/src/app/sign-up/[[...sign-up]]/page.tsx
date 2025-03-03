import React from 'react'
import { SignUp } from '@clerk/nextjs'
export default function page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <SignUp fallbackRedirectUrl="/dashboard" signInUrl="/sign-in"/>
    </div>
  )
}