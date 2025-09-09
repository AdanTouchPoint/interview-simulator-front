"use client";

import { useState, FormEvent } from 'react';
import { User, Building, Briefcase, Factory, PlayCircle, MessageSquare } from 'lucide-react';
interface IntroSimProps {
  onCompletion: (userData: { nombre: string; empresa: string; cargo: string; sector: string }) => void;
}

const IntroSim = ({ onCompletion }: IntroSimProps) => {
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [position, setPosition] = useState('');
    const [sector, setSector] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!name || !sector) {
            alert('Por favor, completa los campos obligatorios: Nombre y Sector');
            return;
        }
        const userData = { nombre: name, empresa: company, cargo: position, sector: sector }
        // Call the callback function passed via props
        onCompletion(userData);
    };

    return (
        <div className="w-full max-w-md animate-fadeIn">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden border border-white/50 p-8 md:p-10">
                <div className="text-center mb-8">
                    <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-800 text-transparent bg-clip-text mb-4">
                        <MessageSquare size={56} className="text-blue-600" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-3xl font-bold mb-2 text-gray-800">
                        Simulador de Entrevistas
                    </h1>
                    <p className="text-md text-gray-500">
                        Completa tus datos para personalizar la experiencia
                    </p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label htmlFor="name" className="flex items-center mb-2 font-semibold text-gray-700">
                            <User className="mr-2 text-blue-600" size={20} />
                            Nombre completo
                        </label>
                        <input 
                            type="text" 
                            id="name" 
                            className="w-full p-3 border-2 border-gray-200 rounded-lg transition duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                            placeholder="Ingresa tu nombre completo" 
                            required 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    
                    <div className="mb-5">
                        <label htmlFor="company" className="flex items-center mb-2 font-semibold text-gray-700">
                            <Building className="mr-2 text-blue-600" size={20} />
                            Empresa
                        </label>
                        <input 
                            type="text" 
                            id="company" 
                            className="w-full p-3 border-2 border-gray-200 rounded-lg transition duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                            placeholder="¿En qué empresa trabajas?"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                        />
                    </div>
                    
                    <div className="mb-5">
                        <label htmlFor="position" className="flex items-center mb-2 font-semibold text-gray-700">
                            <Briefcase className="mr-2 text-blue-600" size={20} />
                            Cargo actual
                        </label>
                        <input 
                            type="text" 
                            id="position" 
                            className="w-full p-3 border-2 border-gray-200 rounded-lg transition duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                            placeholder="¿Cuál es tu puesto?"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                        />
                    </div>
                    
                    <div className="mb-6">
                        <label htmlFor="sector" className="flex items-center mb-2 font-semibold text-gray-700">
                            <Factory className="mr-2 text-blue-600" size={20} />
                            Sector
                        </label>
                        <select 
                            id="sector" 
                            className="w-full p-3 border-2 border-gray-200 rounded-lg transition duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 bg-white"
                            required
                            value={sector}
                            onChange={(e) => setSector(e.target.value)}
                        >
                            <option value="" disabled>Selecciona tu sector</option>
                            <option value="tecnologia">Tecnología y Desarrollo</option>
                            <option value="marketing">Marketing Digital</option>
                            <option value="finanzas">Finanzas y Contabilidad</option>
                            <option value="recursos-humanos">Recursos Humanos</option>
                            <option value="ventas">Ventas y Atención al Cliente</option>
                            <option value="gerencial">Puestos Gerenciales</option>
                            <option value="educacion">Educación</option>
                            <option value="salud">Salud</option>
                            <option value="otros">Otro sector</option>
                        </select>
                    </div>
                    
                    <button type="submit" className="flex items-center justify-center gap-3 w-full p-4 bg-gradient-to-r from-blue-600 to-purple-800 text-white rounded-lg text-lg font-semibold cursor-pointer transition-transform duration-300 shadow-lg shadow-blue-600/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-600/40 animate-pulse">
                        <PlayCircle size={22} />
                        Siguiente
                    </button>
                </form>
                
                <div className="text-center mt-8 text-gray-500 text-xs">
                    <p>© 2025 Simulador de Entrevistas. Todos los derechos reservados.</p>
                </div>
            </div>
        </div>
    );
};

export default IntroSim;
