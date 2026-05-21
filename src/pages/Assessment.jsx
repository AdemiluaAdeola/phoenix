import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import db from '../db'

export default function Assessment() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [answers, setAnswers] = useState({})
  const navigate = useNavigate()

  function handleChange(e) {
    const { name, value } = e.target
    setAnswers((a) => ({ ...a, [name]: value }))
  }

  function computeScore(ans) {
    // simple scoring: count non-empty answers
    return Object.values(ans).filter(Boolean).length
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const score = computeScore(answers)
    await db.assessments.add({ name, email, answers, score, createdAt: new Date() })
    navigate('/')
  }

  return (
    <section className="assessment">
      <h1>Clarity Assessment</h1>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>

        <div className="questions">
          <label>
            What is your primary goal?
            <input name="q1" onChange={handleChange} />
          </label>
          <label>
            What is the biggest obstacle?
            <input name="q2" onChange={handleChange} />
          </label>
          <label>
            What would success look like?
            <input name="q3" onChange={handleChange} />
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn">Submit</button>
        </div>
      </form>

      <section className="schedule">
        <h2>Schedule a meeting</h2>
        <p>If you'd like to schedule a meeting, click the button to open your email client.</p>
        <a
          className="btn muted"
          href={`mailto:?subject=Meeting%20request%20-%20Clarity%20Assessment&body=Hi%2C%0A%0AI%20would%20like%20to%20schedule%20a%20meeting%20to%20discuss%20my%20assessment.%0A%0AThanks%2C%0A`}
        >
          Email to schedule
        </a>
      </section>
    </section>
  )
}
