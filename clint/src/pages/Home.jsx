import React from 'react'
import { getAuth } from '../utils/auth';

export default function Home() {
  const { user, token } = getAuth();
  return (
    <div className="container">
      <div className="card" style={{ marginTop: '2rem' }}>
        <h2>Home</h2>
        <p className="text-muted mt-2">A simple demo for Register/Login flow.</p>
        <div className="mt-4">
          {!token ? (
            <p>You are not logged in. Use the Register and Login links above to continue.</p>
          ) : (
            <p>Welcome back, <strong>{user?.name || user?.email}</strong>!</p>
          )}
        </div>
      </div>
    </div>
  )
}
