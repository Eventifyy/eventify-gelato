import React from 'react'
import { useSelector } from 'react-redux'

const DashboardNew = () => {
  const {user:userData}=useSelector(state=>state)
  console.log(userData)
  return (
    <div>
      
    </div>
  )
}

export default DashboardNew
