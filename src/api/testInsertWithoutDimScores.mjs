// Test inserting without importing supabaseFetch
// Import supabaseFetch from supabaseRestClient.js. Note: we need to import it.
// Since supabaseRestClient doesn't export supabaseFetch, let's write a custom fetch here.
const SUPABASE_URL = 'https://kmrambclpujmnyxbfkjh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttcmFtYmNscHVqbW55eGJma2poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NzMyNjcsImV4cCI6MjA5NTE0OTI2N30.o9Yyoqbk9uPRVaHyg1lrCGEBNHOZyQzgzZZYQD7R8lA';

async function main() {
  const row = {
    first_name: 'Test',
    last_name: 'Without Dim Scores',
    email: 'test.nodims@example.com',
    identity: 'Test',
    source: 'Test',
    context: 'Test',
    responses: [],
    score: 50,
    archetype: 'awakening'
  };

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/assessments?select=*`, {
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
      console.log('✓ Successfully inserted assessment without dim_scores!');
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
