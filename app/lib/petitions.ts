import { UserData } from '@/app/page';
export async function createSession(userData: UserData| null) {
const API_ROUTE = process.env.NEXT_PUBLIC_URL || 'http://localhost:8080/dashBoardContent';
   try {
        const response = await fetch(`${API_ROUTE}/create-session`, {
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
export async function updateSession(userData: UserData| null) {
const API_ROUTE = process.env.NEXT_PUBLIC_URL || 'http://localhost:8080/dashBoardContent';
   try {
        const response = await fetch(`${API_ROUTE}/update-session`, {
            method: 'PUT',
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
