import React from 'react'
import NavBar from './_components/NavBar'

export default function MarketingLAyout({children}:{children:React.ReactNode}) {
  return (
    <div className='selection:bg-[hsl(320,65%,52%,20%)]'>
        <NavBar/>
        {children}
    </div>
  )
}

