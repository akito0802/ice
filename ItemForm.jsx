import React from 'react'
import { db } from '../firebase'
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore'

const CATEGORIES = ['調味料','野菜','肉・魚','乳製品','飲料','加工品','冷凍','おやつ','その他']
const UNITS = ['個','本','袋','g','kg','ml','L','パック']

export default function ItemForm({ uid, editing, onDone }){
  const [form, setForm] = React.useState(()=> editing || {
    name:'', category:'その他', quantity:1, unit:'個', expiry:'', notes:''
  })
  const [busy, setBusy] = React.useState(false)

  const handleChange = (e)=>{
    const { name, value } = e.target
    setForm(prev=>({...prev, [name]: name==='quantity' ? Number(value) : value }))
  }

  const save = async (e)=>{
    e.preventDefault()
    setBusy(true)
    try{
      if (editing && editing.id){
        const d = doc(db, 'users', uid, 'items', editing.id)
        await updateDoc(d, {
          ...form, updatedAt: serverTimestamp()
        })
      }else{
        const col = collection(db, 'users', uid, 'items')
        await addDoc(col, {
          ...form, createdAt: serverTimestamp(), updatedAt: serverTimestamp()
        })
      }
      onDone?.()
    }finally{
      setBusy(false)
    }
  }

  return (
    <form onSubmit={save} className="card">
      <h2>{editing ? 'アイテムを編集' : 'アイテムを追加'}</h2>
      <label>名前</label>
      <input name="name" value={form.name} onChange={handleChange} placeholder="卵 / しょうゆ など" required/>
      <div className="row">
        <div className="col">
          <label>カテゴリ</label>
          <select name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="col">
          <label>数量</label>
          <input type="number" min="0" name="quantity" value={form.quantity} onChange={handleChange}/>
        </div>
        <div className="col">
          <label>単位</label>
          <select name="unit" value={form.unit} onChange={handleChange}>
            {UNITS.map(u=><option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>
      <label>賞味/消費期限</label>
      <input type="date" name="expiry" value={form.expiry} onChange={handleChange}/>
      <label>メモ</label>
      <textarea rows="3" name="notes" value={form.notes} onChange={handleChange} placeholder="使い道や保存場所など"></textarea>
      <div style={{marginTop:12, display:'flex', gap:8}}>
        <button className="btn" disabled={busy}>{busy ? '保存中…' : '保存'}</button>
        <button type="button" className="btn secondary" onClick={()=>onDone?.()}>キャンセル</button>
      </div>
    </form>
  )
}
