import React from 'react'
import Navbar from '@/components/navbar'
export default function layout({children}: {children: React.ReactNode}) {
  return (
    <>
    {/* <Navbar/> */}
    {children}
    </>
  )
}
