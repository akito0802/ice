import React from 'react'
import AuthGate from './components/AuthGate'
import Inventory from './components/Inventory'
import ScrollTopButton from './components/ScrollTopButton'
import './styles.css'

export default function App(){
  return (
    <AuthGate>
      {(user)=>(
        <>
          <Inventory uid={user.uid} />
          <ScrollTopButton/>
        </>
      )}
    </AuthGate>
  )
}
