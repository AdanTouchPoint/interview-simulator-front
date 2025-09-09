"use client";

import { useState, useEffect } from 'react';
// Define the props interface including the onStartSimulation callback
interface InterviewSimProps {
    userName: string;
    initialTopic: string;
    onStartSimulation: (topic: string) => void;
}

const InterviewSim = ({ userName, initialTopic, onStartSimulation }: InterviewSimProps) => {
    const [selectedTopic, setSelectedTopic] = useState(initialTopic);

    useEffect(() => {
        // Ensure the topic is set when the component mounts
        if (initialTopic) {
            setSelectedTopic(initialTopic);
        }
    }, [initialTopic]);

    const handleStart = () => {
        if (!selectedTopic) {
            alert('Por favor, selecciona un tema para continuar.');
            return;
        }
        onStartSimulation(selectedTopic);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl overflow-hidden animate-fadeIn">
            <header className="bg-gradient-to-r from-blue-600 to-purple-800 text-white p-8 text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Simulador de Entrevistas</h1>
                <p className="text-lg md:text-xl opacity-90">Prepárate para tu próximo desafío profesional</p>
            </header>
            
            <main className="p-6 md:p-8">
                <section className="mb-8">
                    <h2 className="text-blue-700 text-2xl font-semibold mb-4 pb-2 border-b-2 border-gray-200">
                        ¡Bienvenido, {userName}!
                    </h2>
                    <p className="text-gray-600">
                        Esta es tu plataforma para practicar y perfeccionar tus habilidades de entrevista. Podrás simular un entorno realista, recibir retroalimentación y ganar la confianza que necesitas.
                    </p>
                </section>
                


                <section>
                    <button onClick={handleStart} className="mt-6 block w-full p-4 bg-gradient-to-r from-blue-600 to-purple-800 text-white rounded-xl text-lg font-semibold cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" disabled={!selectedTopic}>
                        Comenzar Simulación
                    </button>
                </section>
            </main>
            
            <footer className="text-center p-5 bg-gray-50 border-t">
                <p className="text-gray-500 text-sm">© 2025 Simulador de Entrevistas. Buena suerte.</p>
            </footer>
        </div>
    );
};

export default InterviewSim;
