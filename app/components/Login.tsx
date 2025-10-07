"use client";
import { useState } from 'react';
// Asegúrate de que tu función fetchUserInfo maneje la validación de credenciales.
// En un caso real, la función enviaría {username, password} al servidor
// y el servidor respondería con la información del usuario o un error de autenticación.
import { fetchUserInfo } from '../lib/petitions'; 

interface LoginProps {
  onLoginSuccess: () => void;
}

// Interfaz UserInfo (se mantiene)
interface UserInfo {
  id: string;
  username: string;
  active: boolean;
  // En una app real, podrías añadir un token de sesión aquí
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // Nuevo estado: Para manejar la carga y deshabilitar el botón
  const [isLoading, setIsLoading] = useState(false);
  // Nuevo estado: Para mostrar mensajes de error al usuario
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpia cualquier error previo
    setIsLoading(true); // Inicia el estado de carga

    try {
      // **CRÍTICO:** Usar await para esperar la respuesta asíncrona
      const info = await fetchUserInfo(password); // Modifica fetchUserInfo para recibir password
      const userInfo = info.user as UserInfo; // Asegura que info es del tipo UserInfo
      if (userInfo.active === true) {
        // Éxito: Llamar a la función de éxito
        onLoginSuccess(); 
      } else {
        // Si el usuario existe pero no está activo
        setError('User not active. Please check your email to activate.');
      }
    } catch (err: any) {
      // Captura errores de la petición o de credenciales inválidas
      // Se asume que fetchUserInfo lanza un error en caso de credenciales incorrectas.
      console.error("Login failed:", err);
      // Muestra un mensaje de error genérico o el mensaje específico del error
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false); // Detiene el estado de carga, independientemente del resultado
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <form 
        onSubmit={handleSubmit} 
        style={{ padding: '40px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', backgroundColor: 'white', display: 'flex', flexDirection: 'column', gap: '20px', width: '300px' }}
      >
        <h2 style={{ textAlign: 'center', color: '#333' }}>Login</h2>
        
        {/* Muestra el mensaje de error */}
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
          // Deshabilitar el input mientras está cargando
          disabled={isLoading}
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          // Deshabilitar el input mientras está cargando
          disabled={isLoading}
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button 
          type="submit" 
          // Deshabilitar el botón mientras está cargando
          disabled={isLoading}
          style={{ 
            padding: '10px', 
            borderRadius: '4px', 
            border: 'none', 
            backgroundColor: isLoading ? '#a0c7f8' : '#0070f3', // Cambia el color si está cargando
            color: 'white', 
            cursor: isLoading ? 'not-allowed' : 'pointer' 
          }}
        >
          {/* Texto dinámico para el botón */}
          {isLoading ? 'Logging In...' : 'Log In'}
        </button>
      </form>
    </div>
  );
}