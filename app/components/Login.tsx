"use client";
import { useState } from 'react';

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, we'll just simulate a successful login
    // In a real app, you'd validate credentials here
    console.log('Logging in with:', { username, password });
    onLoginSuccess();
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <form onSubmit={handleSubmit} style={{ padding: '40px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', backgroundColor: 'white', display: 'flex', flexDirection: 'column', gap: '20px', width: '300px' }}>
        <h2 style={{ textAlign: 'center', color: '#333' }}>Login</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '10px', borderRadius: '4px', border: 'none', backgroundColor: '#0070f3', color: 'white', cursor: 'pointer' }}>
          Log In
        </button>
      </form>
    </div>
  );
}
