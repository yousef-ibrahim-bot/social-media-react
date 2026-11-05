import React from 'react'
import NavBar from './Navbar/NavBar'
import Footer from './footer/Footer'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (<>
  
  <NavBar/>
  <Outlet/>
  
  </>

  )
}
