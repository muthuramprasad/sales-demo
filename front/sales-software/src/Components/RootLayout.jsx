import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div>


      <main>
        <Outlet/>
      </main>
    </div>
  )
}

export default RootLayout
