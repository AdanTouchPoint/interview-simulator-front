"use client";
import { useState } from 'react';

import { fetchUserInfo } from '../lib/petitions'; 

interface LoginProps {
  onLoginSuccess: () => void;
}

interface UserInfo {
  id: string;
  username: string;
  active: boolean;
  // En una app real, podrías añadir un token de sesión aquí
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); 
    setIsLoading(true); 

    try {
     
      const info = await fetchUserInfo(password); 
      const userInfo = info.user as UserInfo; 
      if (userInfo.active === true) {
        
        onLoginSuccess(); 
      } else {
       
        setError('User not active. Please check your email to activate.');
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <form 
        onSubmit={handleSubmit} 
        style={{ padding: '40px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', backgroundColor: 'white', display: 'flex', flexDirection: 'column', gap: '20px', width: '300px' }}
      >
        <h2 style={{ textAlign: 'center', color: '#333' }}>Login</h2>
        
       
        {error && (
          <p style={{ color: 'red', textAlign: 'center', border: '1px solid #f8d7da', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px' }}>
            {error}
          </p>
        )}
        
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          
          disabled={isLoading}
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          
          disabled={isLoading}
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button 
          type="submit" 
         
          disabled={isLoading}
          style={{ 
            padding: '10px', 
            borderRadius: '4px', 
            border: 'none', 
            backgroundColor: isLoading ? '#a0c7f8' : '#0070f3', 
            color: 'white', 
            cursor: isLoading ? 'not-allowed' : 'pointer' 
          }}
        >
      
          {isLoading ? 'Logging In...' : 'Log In'}
        </button>
      </form>
    </div>
  );
}