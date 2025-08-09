import React from 'react'

export default function ScrollTopButton(){
  const [show, setShow] = React.useState(false)
  React.useEffect(()=>{
    const onScroll = ()=> setShow(window.scrollY > 300)
    window.addEventListener('scroll', onScroll)
    return ()=>window.removeEventListener('scroll', onScroll)
  },[])
  if (!show) return null
  return (
    <button className="btn fixed-top" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>
      ↑ 上へ戻る
    </button>
  )
}
