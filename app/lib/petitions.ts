//gebnerate fetch  function post request to the endpoint /creaate-session
import { UserData } from '@/app/page';
export async function createSession(userData: UserData| null) {
   try {
        const response = await fetch('http://localhost:8080/dashBoardContent/create-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) throw new Error('Error en la petición');
        
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
