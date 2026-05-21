import Dexie from 'dexie'

const db = new Dexie('ClarityDB')

db.version(1).stores({
  assessments: '++id, name, email, score, createdAt'
})

export default db
