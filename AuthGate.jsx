import React from 'react'
import { auth, provider } from '../firebase'
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'

export default function AuthGate({ children }){
  const [user, setUser] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(()=>{
    const unsub = onAuthStateChanged(auth, u=>{ setUser(u); setLoading(false) })
    return ()=>unsub()
  },[])

  if (loading) return <div className="container"><div className="card">読み込み中...</div></div>

  if (!user){
    return (
      <div className="container">
        <div className="card" style={{textAlign:'center'}}>
          <h1>冷蔵庫ストック管理</h1>
          <p className="kicker">Googleでログインしてはじめよう</p>
          <button className="btn" onClick={()=>signInWithPopup(auth, provider)}>Googleでログイン</button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="container">
        <div className="row" style={{alignItems:'center'}}>
          <div className="col">
            <h1>冷蔵庫ストック管理</h1>
            <div className="kicker">ようこそ {user.displayName || 'ユーザー'} さん</div>
          </div>
          <div className="col" style={{textAlign:'right'}}>
            <button className="btn secondary" onClick={()=>signOut(auth)}>ログアウト</button>
          </div>
        </div>
      </div>
      {children(user)}
    </>
  )
}
