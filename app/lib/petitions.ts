import { UserData } from '@/app/page';
import { VideoData } from '../components/InterviewSimApp';
const API_ROUTE = process.env.NEXT_PUBLIC_URL || 'http://localhost:8080/dashBoardContent';
const API_SERVICES = process.env.NEXT_PUBLIC_API_SERVICES || 'http://localhost:8080/dashBoardServices';
export async function createSession(userData: UserData| null) {

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

export async function startMediaUpload(data:VideoData) {
   try {
        const response = await fetch(`${API_SERVICES}/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
             body: JSON.stringify({
        fileName: data.name,
        fileType: data.type,
      }),
        });

        if (!response.ok) throw new Error('Error en la petición');
        
    // Guardamos los datos que el backend nos devuelve.
    // Son CRUCIALES para los siguientes pasos.
    const { sessionUri, videoId } = await response.json();
    
    console.log('Permiso obtenido. URL de subida:', sessionUri);
    
    return { sessionUri, videoId };
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Función que sube el archivo a Google Cloud
export async function uploadFileToGCS(sessionUri: string, videoFile: File | Blob) {
  // Define el tamaño de cada trozo. 5MB es un tamaño robusto.
  // GCS requiere que el tamaño sea un múltiplo de 256 KiB (262144 bytes).
  const CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB
  const totalSize = videoFile.size;
  let start = 0;

  try {
    while (start < totalSize) {
      const end = Math.min(start + CHUNK_SIZE, totalSize);
      const chunk = videoFile.slice(start, end);

      // La cabecera 'Content-Range' es la clave.
      // Le dice a Google qué parte del archivo total estamos enviando.
      // Formato: "bytes <inicio>-<fin-1>/<tamaño-total>"
      const contentRange = `bytes ${start}-${end - 1}/${totalSize}`;
      
      console.log(`Enviando chunk: ${contentRange}`);

      const response = await fetch(sessionUri, {
        method: 'PUT',
        headers: {
          'Content-Range': contentRange,
          'Content-Type': videoFile.type,
          'Content-Length': chunk.size.toString(),
        },
        body: chunk,
      });

      // Google responde con '308 Resume Incomplete' para confirmar que recibió el trozo.
      // Al recibir el último trozo, responde con '200 OK' o '201 Created'.
 if (response.status === 308) {
    // Upload incompleto → seguimos con el siguiente chunk
    start = end;
    continue;
  }

  if (response.status === 200) {
    // ✅ Subida completa
    console.log("Upload terminado con éxito en GCS.");
    // 🚨 IMPORTANTE: NO hagas res.json() ni res.text()
    return true;
  }

  // Si llega aquí, hubo error
  throw new Error(`Error subiendo chunk. Status: ${response.status}`);


  }} catch (error) {
    console.error('Error durante la subida por chunks:', error);
    return false;
  }
}
// Función que llama al endpoint /complete
export async function completeUploadProcess(videoId: string) {
  try {
    const response = await fetch(`${API_SERVICES}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Aquí iría tu cabecera de autenticación
        // 'Authorization': `Bearer ${tu_token_jwt}`
      },
      body: JSON.stringify({ videoId }),
    });

    if (!response.ok) {
      throw new Error('No se pudo notificar la finalización.');
    }

    const result = await response.json();
    console.log('Backend notificado:', result.message);
    return true;

  } catch (error) {
    console.error('Error en /complete:', error);
    return false;
  }
}