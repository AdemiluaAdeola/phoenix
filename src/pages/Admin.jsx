import { useEffect, useState } from 'react'
import db from '../db'
import { exportAssessmentsToExcel } from '../utils/exportExcel'

export default function Admin() {
  const [items, setItems] = useState([])

  useEffect(() => {
    let mounted = true
    db.assessments.toArray().then((all) => {
      if (mounted) setItems(all.reverse())
    })
    return () => (mounted = false)
  }, [])

  return (
    <section className="admin">
      <h1>Admin Dashboard</h1>
      <div className="admin-actions">
        <button className="btn" onClick={() => exportAssessmentsToExcel(items)}>
          Export to Excel
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Score</th>
            <th>Submitted</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id}>
              <td>{it.id}</td>
              <td>{it.name}</td>
              <td>{it.email}</td>
              <td>{it.score}</td>
              <td>{new Date(it.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
