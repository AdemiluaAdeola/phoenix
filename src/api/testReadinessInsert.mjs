const SUPABASE_URL = 'https://kmrambclpujmnyxbfkjh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttcmFtYmNscHVqbW55eGJma2poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NzMyNjcsImV4cCI6MjA5NTE0OTI2N30.o9Yyoqbk9uPRVaHyg1lrCGEBNHOZyQzgzZZYQD7R8lA';

async function main() {
  const row = {
    first_name: 'Test',
    last_name: 'Readiness',
    email: 'test.readiness@example.com',
    score: 80,
    responses: [{ q: 1, a: 4 }],
    session_type: 'clarity-intensive',
    session_date: '2026-06-01'
  };

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/readiness?select=*`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify(row)
    });

    if (res.ok) {
      const data = await res.json();
      console.log('✓ Successfully inserted readiness with extra columns!');
      console.log('Inserted record:', data);
    } else {
      const text = await res.text();
      console.error('✗ Failed to insert. Status:', res.status, text);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
