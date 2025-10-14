'use client'; // Directiva para indicar que es un Componente de Cliente

import React, { useState, useEffect } from 'react';
import {LucidePauseCircle, LucidePlayCircle, LucideCircleStop} from 'lucide-react';
// 1. Se define una interfaz para las props del componente.
//    Esto asegura que siempre se le pase una prop 'text' de tipo string.
interface TextToSpeechPlayerProps {
  text: string;
}

const TextToSpeechPlayer: React.FC<TextToSpeechPlayerProps> = ({ text }) => {
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  // 2. Se tipa el estado 'utterance'. Puede ser un objeto SpeechSynthesisUtterance o null.
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  // Se ejecuta solo en el cliente
  useEffect(() => {
    // Las APIs del navegador como 'window' y 'SpeechSynthesisUtterance' ya tienen tipos
    // definidos por defecto en TypeScript, por lo que no se necesita trabajo adicional aquí.
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(text);

    setUtterance(u);

    // Limpieza al desmontar el componente
    return () => {
      // Se comprueba si synth existe por seguridad, aunque siempre debería estarlo en el cliente.
      if (synth) {
        synth.cancel();
      }
    };
  }, [text]);

  const handlePlay = () => {
    // 3. Se añade una comprobación para asegurar que 'utterance' no sea null.
    //    Esto satisface a TypeScript y previene errores en tiempo de ejecución.
    if (!utterance) return;

    const synth = window.speechSynthesis;
    if (isPaused) {
      synth.resume();
    } else {
      synth.speak(utterance);
    }
    setIsPaused(false);
  };

  const handlePause = () => {
    const synth = window.speechSynthesis;
    synth.pause();
    setIsPaused(true);
  };

  const handleStop = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    setIsPaused(false);
  };

  return (
    <div>
      <LucidePlayCircle onClick={handlePlay}/>
      <LucidePauseCircle onClick={handlePause}/>
      <LucideCircleStop onClick={handleStop}/>
    </div>
  );
};

export default TextToSpeechPlayer;