async function registerUser(payload) {
  const res = await fetch('http://localhost:4000/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

registerUser({ name: 'Alice', email: 'alice@example.com', password: 'secret123' })
  .then(user => console.log('registered', user))
  .catch(err => console.error('error', err));