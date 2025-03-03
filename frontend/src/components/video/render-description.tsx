"use client"

import React from 'react'

export default function RenderDescription({description}: {description: string}) {
  return (
    <div>   <p className={`text-sm description-content`} dangerouslySetInnerHTML={{ __html: description }} /></div>
  )
}
