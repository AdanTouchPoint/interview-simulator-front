"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import {
    MessageSquare,
    HelpCircle,
    ListOrdered,
    ArrowLeft,
    ArrowRight,
    Video,
    VolumeX,
    Circle,
    Maximize,
    RotateCw,
    Square,
    PauseIcon,
} from 'lucide-react';
import { updateSession,startMediaUpload,uploadFileToGCS,completeUploadProcess } from '@/app/lib/petitions';
import { UserData } from '@/app/page';


interface InterviewSimAppProps {
    topic: string;
    onFinish: () => void;
    userData: UserData | null;
    setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
}
export interface VideoData {
    name: string;
    type: string;
}
const questionsDb: { [key: string]: string[] } = {
    "tecnologia": [
        "¿Puedes describir un proyecto desafiante en el que hayas trabajado y cómo superaste los obstáculos?",
        "¿Cómo manejas los plazos ajustados y la presión en el trabajo?",
        "Háblame de una vez que tuviste que aprender una nueva tecnología rápidamente.",
        "Describe cómo trabajas en equipo y resuelves conflictos.",
        "¿Cuál es tu stack tecnológico preferido y por qué?",
        "¿Cómo manejas el feedback negativo sobre tu trabajo?",
        "Háblame de tu experiencia con metodologías ágiles.",
        "Describe tu approach para debuggear un problema complejo.",
        "¿Cómo te mantienes actualizado con las últimas tendencias tecnológicas?",
        "¿Dónde te ves en 5 años dentro de tu carrera profesional?"
    ],
    "marketing": [
        "Describe una campaña de marketing digital exitosa que hayas liderado.",
        "¿Cómo mides el ROI de tus estrategias de marketing?",
        "¿Qué herramientas de análisis de datos prefieres y por qué?",
        "Háblame de una vez que una campaña no funcionó como esperabas y qué aprendiste.",
        "¿Cómo te mantienes al día con los cambios en los algoritmos de redes sociales?"
    ],
};

const InterviewSimApp = ({ topic, onFinish, userData, setUserData }: InterviewSimAppProps) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(150);
    const [isRecording, setIsRecording] = useState(false);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);

   const uploadRecording = async () => {
    // Asumimos que estas variables vienen de tu estado o props
    // const { userData, recordedChunksRef, addLog, setUploadProgress } = this.props;

    if (recordedChunksRef.current.length === 0) {
        addLog("No hay grabación para subir.");
        return;
    }

    try {
        addLog("Preparando la subida...");
      
        // --- PASO 1: LLAMAR AL ENDPOINT /START ---
        const mediaInfo : VideoData = {
            type: "video/webm",
            name: `recording-${userData?.sessionId || 'default'}.webm`
        };
        const startResponse = await startMediaUpload( mediaInfo ); // Llama a tu API /start
        const { sessionUri, videoId } = startResponse;

        if (!sessionUri || !videoId) {
            throw new Error("Respuesta inválida del endpoint /start");
        }
        
        // --- PASO 2: SUBIR EL ARCHIVO DIRECTAMENTE A GCS ---
        addLog("Ensamblando y subiendo grabación a Google Cloud...");
        const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
        
        // La subida directa usa el Blob, no FormData
        const uploadSuccess = await uploadFileToGCS(sessionUri, blob);

        if (!uploadSuccess) {
            throw new Error("La subida a Google Cloud Storage falló.");
        }

        // --- PASO 3: LLAMAR AL ENDPOINT /COMPLETE ---
        addLog("Notificando al servidor la finalización de la subida...");
        await completeUploadProcess( videoId ); // Llama a tu API /complete

        addLog("¡Proceso de subida completado con éxito!");
        alert("¡Subida completada! Tu video se está procesando.");

    } catch (error) {
        addLog(`Error en el proceso de subida: ${error}`);
        console.error("Error en uploadRecording:", error);
        alert("Hubo un problema al subir tu grabación. Por favor, inténtalo de nuevo.");
    } finally {
        // Limpiar los chunks después de un intento exitoso o fallido
        recordedChunksRef.current = [];
    }
};

    const addLog = useCallback((action: string) => {
        const newLog = `${new Date().toLocaleString()}: ${action}`;
        setLogs(prevLogs => [...prevLogs, newLog]);
    }, []);

    const questions = questionsDb[topic] || questionsDb['tecnologia'];
    const totalQuestions = questions.length;

    // Timer effect
    useEffect(() => {
        if (timeLeft <= 0 || !isTimerActive) return;
        const timerInterval = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timerInterval);
    }, [timeLeft, isTimerActive]);

    // Camera effect
    useEffect(() => {
        addLog("Simulación iniciada, activando cámara.");
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true,audio: true })
                .then((stream) => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        setIsCameraReady(true);
                        addLog("Cámara activada exitosamente.");
                    }
                })
                .catch(err => {
                    console.error("Error accessing camera: ", err);
                    addLog("Error: No se pudo acceder a la cámara.");
                    alert("No se pudo acceder a la cámara. Por favor, asegúrate de que los permisos están concedidos.");
                });
        }
    }, [addLog]);

    const resetSimulationState = () => {
        setTimeLeft(150);
        setIsRecording(false);
        setIsTimerActive(false);
    };

    const handleStartSimulation = () => {
        addLog("Click: Iniciar Grabación");
        if (isCameraReady && videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "video/webm" });

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = uploadRecording;

            mediaRecorderRef.current.start(10000); // Grabar en chunks de 10 segundos
            setIsRecording(true);
            setIsTimerActive(true);
            addLog("Grabación y temporizador iniciados.");
        } else {
            addLog("Error: Intento de iniciar grabación sin cámara lista.");
            alert("La cámara no está activa. Por favor, concede los permisos y asegúrate de que está funcionando.");
        }
    };

    const handlePauseResume = () => {
        addLog(`Click: ${isTimerActive ? 'Pausar' : 'Reanudar'} Temporizador`);
        if (mediaRecorderRef.current) {
            if (isTimerActive) {
                mediaRecorderRef.current.pause();
                addLog("Grabación pausada.");
            } else {
                mediaRecorderRef.current.resume();
                addLog("Grabación reanudada.");
            }
        }
        setIsTimerActive(prev => !prev);
    };

    const handleFinish = async () => {
        addLog("Click: Finalizar Simulación");

        if (mediaRecorderRef.current && (mediaRecorderRef.current.state === "recording" || mediaRecorderRef.current.state === "paused")) {
            mediaRecorderRef.current.stop(); // Esto activará el evento onstop y la subida
        }

        if (userData) {
            const updatedUserData = {
                ...userData,
                logs: logs
            };
            
            setUserData(updatedUserData);

            try {
                addLog("Enviando datos de la sesión al servidor.");
                await updateSession(updatedUserData);
                addLog("Datos de la sesión actualizados exitosamente.");
            } catch (error) {
                addLog("Error: no se pudieron actualizar los datos de la sesión.");
                console.error("Failed to update session:", error);
                alert("Hubo un error al guardar tu sesión. Por favor, inténtalo de nuevo.");
            }
        } else {
            addLog("Error: userData no disponible para finalizar la sesión.");
        }

        onFinish();
    };

    const handleNext = () => {
        addLog(`Click: Siguiente Pregunta (pregunta actual: ${currentQuestionIndex + 1})`);
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            resetSimulationState();
        }
    };

    const handlePrev = () => {
        addLog(`Click: Pregunta Anterior (pregunta actual: ${currentQuestionIndex + 1})`);
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
            resetSimulationState();
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    const timerProgress = ((150 - timeLeft) / 150) * 100;

    return (
        <div style={{minWidth:'100%'}}>
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans animate-fadeIn overflow-x-hidden">
            {/* Header */}
            <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-4 flex justify-between items-center shadow-md z-10">
                <div className="flex items-center gap-3">
                    <MessageSquare size={28} />
                    <span className="text-xl font-bold">InterviewSim</span>
                </div>
                <div className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                    {topic.charAt(0).toUpperCase() + topic.slice(1).replace(/-/g, ' ')}
                </div>
            </header>

            {/* Main Content - Fixed width container */}
            <div className="flex-1 flex justify-center p-4 overflow-x-hidden">
                <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
                    {/* Left Panel - Fixed width */}
                    <div className="w-full lg:w-7/12 min-w-0"> {/* Added min-w-0 to prevent overflow */}
                        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 flex flex-col hover:shadow-xl transition-shadow duration-300">
                            <h2 className="text-blue-600 text-xl font-semibold flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                                <HelpCircle />
                                Pregunta Actual
                            </h2>
                            
                            {/* Question Area with fixed width and text wrapping */}
                            <div className="min-h-40 mb-6 break-words"> {/* Added break-words */}
                                <p className="text-xl text-gray-800 leading-relaxed p-4 bg-blue-50/70 border-l-4 border-blue-500 rounded-r-lg">
                                    {questions[currentQuestionIndex]}
                                </p>
                            </div>

                            {/* Timer Section */}
                            <div className="flex justify-center items-center my-6">
                                <div
                                    className="relative w-36 h-36 flex items-center justify-center"
                                    style={{ background: `conic-gradient(#4f46e5 ${timerProgress}%, #e0e7ff ${timerProgress}%)`}}
                                >
                                    <div className="absolute w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-inner">
                                        <span className="text-3xl font-bold text-blue-600">{formatTime(timeLeft)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Progress and navigation */}
                            <div>
                                <div className="text-center my-6 font-semibold text-gray-600 flex items-center justify-center gap-2">
                                    <ListOrdered size={20} />
                                    Pregunta <span className="text-blue-600 font-bold">{currentQuestionIndex + 1}</span> de <span className="text-blue-600 font-bold">{totalQuestions}</span>
                                </div>

                                <div className="my-6">
                                    <div className="flex justify-between mb-2 font-medium text-gray-600">
                                        <span>Progreso de la simulación</span>
                                        <span>{Math.round(progressPercentage)}%</span>
                                    </div>
                                    <div className="w-full bg-indigo-100 rounded-full h-2.5">
                                        <div 
                                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-500" 
                                            style={{ width: `${progressPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="flex justify-between gap-4 pt-6">
                                    <button 
                                        onClick={handlePrev} 
                                        disabled={currentQuestionIndex === 0} 
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ArrowLeft size={20} /> Anterior
                                    </button>
                                    <button 
                                        onClick={handleNext} 
                                        disabled={currentQuestionIndex === totalQuestions - 1}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Siguiente <ArrowRight size={20} />
                                    </button>
                                </div>
                            </div>
                            {/* Logs Section */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <details className="bg-gray-50 rounded-lg">
                                    <summary className="px-4 py-2 font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 rounded-t-lg">
                                        Ver Registro de Actividad
                                    </summary>
                                    <div className="p-2 border-t border-gray-200">
                                        <div className="max-h-32 overflow-y-auto p-2 bg-white rounded-b-lg">
                                            {logs.length > 0 ? logs.slice().reverse().map((log, index) => (
                                                <p key={index} className="text-xs text-gray-700 font-mono whitespace-pre-wrap">
                                                    {log}
                                                </p>
                                            )) : <p className="text-xs text-gray-500">No hay actividad registrada.</p>}
                                        </div>
                                    </div>
                                </details>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Fixed width */}
                    <div className="w-full lg:w-5/12 flex flex-col gap-6 min-w-0"> {/* Added min-w-0 */}
                        <div className="relative bg-gray-900 rounded-2xl shadow-lg flex-1 flex items-center justify-center overflow-hidden min-h-96"> {/* Added min-h */}
                            <video ref={videoRef} autoPlay muted className="w-full h-full object-cover"></video>
                            <div className="absolute inset-0 flex items-center justify-center" style={{ display: videoRef.current?.srcObject ? 'none' : 'flex' }}>
                                <div className="text-center text-gray-400">
                                    <Video size={64} className="mx-auto mb-4" />
                                    <p>Activando cámara...</p>
                                </div>
                            </div>
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                                <button onClick={() => addLog('Click: Silenciar/Activar Sonido')} className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-sm text-gray-800 flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                                    <VolumeX />
                                </button>
                                <button
                                    onClick={handlePauseResume}
                                    disabled={!isRecording}
                                    className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${isRecording ? (isTimerActive ? 'bg-red-500' : 'bg-yellow-500') : 'bg-blue-600'}`}
                                >
                                    {isTimerActive ? <PauseIcon className="text-white" /> : <Circle className="text-white" />}
                                </button>
                                <button onClick={() => addLog('Click: Maximizar Video')} className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-sm text-gray-800 flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                                    <Maximize />
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex gap-4">
                            <button onClick={handleStartSimulation} disabled={isTimerActive} className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                <Video size={20} /> Iniciar Grabación
                            </button>
                            <button onClick={handleFinish} className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <Square size={20} /> Finalizar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="text-center p-4 bg-white/50 text-gray-500 text-sm mt-auto">
                <p>© 2025 Simulador de Entrevistas. Todos los derechos reservados.</p>
            </footer>
        </div>
        </div>
    );
};

export default InterviewSimApp;
