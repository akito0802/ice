import React from 'react'
import { db } from '../firebase'
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import ItemForm from './ItemForm'
import { format } from 'date-fns'

const CATEGORIES = ['調味料','野菜','肉・魚','乳製品','飲料','加工品','冷凍','おやつ','その他']

function Expiry({ dateStr }){
  if (!dateStr) return <span className="badge">期限未設定</span>
  const today = new Date()
  const d = new Date(dateStr + 'T00:00:00')
  const diff = Math.ceil((d - today)/(1000*60*60*24))
  let label = format(d, 'yyyy/MM/dd') + '（' + (diff>=0?`あと${diff}日`:`${-diff}日前`) + '）'
  const style = { color: diff<0 ? '#ff6b6b' : diff<=3 ? '#ffb703' : 'inherit' }
  return <span className="badge" style={style}>{label}</span>
}

export default function Inventory({ uid }){
  const [items, setItems] = React.useState([])
  const [q, setQ] = React.useState('')
  const [cat, setCat] = React.useState('すべて')
  const [editing, setEditing] = React.useState(null)
  const [adding, setAdding] = React.useState(false)

  React.useEffect(()=>{
    const col = collection(db, 'users', uid, 'items')
    const qq = query(col, orderBy('category'), orderBy('name'))
    const unsub = onSnapshot(qq, snap=>{
      const arr = snap.docs.map(d=>({ id: d.id, ...d.data() }))
      setItems(arr)
    })
    return ()=>unsub()
  },[uid])

  const filtered = items
    .filter(it=> (cat==='すべて' || it.category===cat) && (it.name?.toLowerCase().includes(q.toLowerCase())))

  const dec = async (item)=>{
    await updateDoc(doc(db, 'users', uid, 'items', item.id), { quantity: Math.max(0, (item.quantity||0)-1) })
  }

  const inc = async (item)=>{
    await updateDoc(doc(db, 'users', uid, 'items', item.id), { quantity: (item.quantity||0)+1 })
  }

  const del = async (item)=>{
    if (!confirm(`「${item.name}」を削除しますか？`)) return
    await deleteDoc(doc(db, 'users', uid, 'items', item.id))
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="row" style={{alignItems:'end'}}>
              <div className="col">
                <label>検索</label>
                <input placeholder="名前で検索…" value={q} onChange={e=>setQ(e.target.value)} />
              </div>
              <div className="col">
                <label>カテゴリ</label>
                <select value={cat} onChange={e=>setCat(e.target.value)}>
                  <option>すべて</option>
                  {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="col" style={{textAlign:'right'}}>
                <button className="btn" onClick={()=>{ setAdding(true); setEditing(null) }}>＋ 追加</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {adding && <ItemForm uid={uid} onDone={()=>setAdding(false)} />}
      {editing && <ItemForm uid={uid} editing={editing} onDone={()=>setEditing(null)} />}

      <div className="grid">
        {CATEGORIES.filter(c=>cat==='すべて' or c===cat).map(category=>{
          const list = filtered.filter(i=>i.category===category)
          if (!list.length) return null
          return (
            <div key={category} className="card">
              <h2>{category} <span className="kicker">（{list.length}）</span></h2>
              {list.map(item=>(
                <div key={item.id} className="item">
                  <div>
                    <div style={{fontWeight:700}}>{item.name}</div>
                    <div className="kicker">
                      {item.quantity ?? 0}{item.unit || ''}・<Expiry dateStr={item.expiry} />
                    </div>
                    {item.notes && <div className="kicker">メモ: {item.notes}</div>}
                  </div>
                  <div style={{display:'flex',gap:6}}>
                    <button className="btn secondary" onClick={()=>dec(item)}>-</button>
                    <button className="btn secondary" onClick={()=>inc(item)}>+</button>
                    <button className="btn secondary" onClick={()=>setEditing(item)}>編集</button>
                    <button className="btn" onClick={()=>del(item)}>削除</button>
                  </div>
                </div>
              ))}
            </div>
          )
        })}
      </div>

      <footer className="container">
        <div className="kicker">データはあなたのFirebaseプロジェクトに保存されます（Firestoreのみ）。</div>
      </footer>
    </div>
  )
}
