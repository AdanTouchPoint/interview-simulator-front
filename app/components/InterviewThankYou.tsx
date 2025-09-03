"use client";

import { useState, useEffect } from 'react';
import { CheckCircle2, Mail, RefreshCw } from 'lucide-react';

interface InterviewThankYouProps {
    onRestart: () => void;
}

const ConfettiPiece = ({ id }: { id: number }) => {
    const colors = ['#4361ee', '#3a0ca3', '#4cc9f0', '#f72585', '#7209b7'];
    const style = {
        left: `${Math.random() * 100}vw`,
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        width: `${5 + Math.random() * 10}px`,
        height: `${5 + Math.random() * 10}px`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${3 + Math.random() * 5}s`,
    };
    return <div className="confetti fixed top-0 opacity-70 animate-confetti-fall z-[-1]" style={style}></div>;
};

const InterviewThankYou = ({ onRestart }: InterviewThankYouProps) => {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const userDataString = localStorage.getItem('userData');
        if (userDataString) {
            const userData = JSON.parse(userDataString);
            if (userData.name) {
                setUserName(userData.name);
            }
        }
    }, []);

    return (
        <div className="w-full max-w-2xl mx-auto animate-fadeIn">
            {Array.from({ length: 50 }).map((_, i) => <ConfettiPiece key={i} id={i} />)}
            
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 p-8 md:p-12 text-center">
                <header className="mb-8">
                    <div className="inline-block animate-bounce mb-6">
                        <CheckCircle2 size={80} className="bg-gradient-to-r from-blue-600 to-purple-700 text-transparent bg-clip-text" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        {userName ? `¡Felicidades, ${userName}!` : '¡Simulación Completada!'}
                    </h1>
                    <p className="text-lg text-gray-600">
                        Gracias por participar. Tu grabación ha sido guardada exitosamente.
                    </p>
                </header>

                <div className="bg-blue-50/80 border-l-4 border-blue-500 rounded-r-lg p-6 text-left my-8">
                    <h3 className="flex items-center gap-3 font-semibold text-blue-800 text-lg mb-4">
                        <Mail size={22} />
                        Retroalimentación Profesional
                    </h3>
                    <p className="text-gray-700 mb-2">
                        Tu grabación será revisada por un <span className="font-semibold text-blue-600">experto en recursos humanos</span>.
                    </p>
                    <p className="text-gray-700">
                        Recibirás un análisis detallado por correo en <span className="font-semibold text-blue-600">2 a 4 días hábiles</span> para ayudarte a identificar tus fortalezas y áreas de mejora.
                    </p>
                </div>

                <footer className="mt-10">
                    <button 
                        onClick={onRestart}
                        className="flex items-center justify-center gap-3 w-full max-w-xs mx-auto p-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg text-lg font-semibold cursor-pointer transition-transform duration-300 shadow-lg shadow-blue-600/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-600/40"
                    >
                        <RefreshCw size={22} />
                        Realizar otra simulación
                    </button>
                    <p className="text-gray-500 text-sm mt-8">
                        © 2025 Simulador de Entrevistas. Todos los derechos reservados.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default InterviewThankYou;
