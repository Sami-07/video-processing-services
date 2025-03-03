import React from 'react'
import { SignIn } from '@clerk/nextjs'
export default function page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <SignIn fallbackRedirectUrl="/dashboard" signUpUrl="/sign-up"/>
    </div>
  )
}