"use client";

import { useState } from 'react';
import IntroSim from './components/IntroSim';
import InterviewSim from './components/InterviewSim';
import InterviewSimApp from './components/InterviewSimApp';
import InterviewThankYou from './components/InterviewThankYou';
import { createSession } from  "./lib/petitions";

// Define a type for the user data
export type UserData = {
  nombre: string;
  empresa: string;
  cargo: string;
  sector: string;
  sessionId?: string;
  logs?: string[];
};

// Define the steps of the application flow
type AppStep = 'intro' | 'welcome' | 'simulation' | 'thankyou';

export default function Home() {
  const [step, setStep] = useState<AppStep>('intro');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [topic, setTopic] = useState('');

  // 1. Called when the intro form is completed
  const handleIntroCompletion = (data: UserData) => {
    setUserData(data);
    setStep('welcome');
  };

  // 2. Called when the user clicks "Start Simulation" on the welcome screen
  const handleStartSimulation =  async (selectedTopic: string) => {
    setTopic(selectedTopic);
    const sessions = await createSession(userData);
    if (userData && sessions && sessions.data) {
      setUserData({...userData, sessionId: sessions.data.id});
    }
    setStep('simulation');
  };

  // 3. Called when the simulation is finished
  const handleSimulationFinish = () => {
    setStep('thankyou');
  };

  // 4. Called to restart the whole process
  const handleRestart = () => {
    setUserData(null);
    setTopic('');
    setStep('intro');
  };

  // Render the correct component based on the current step
  const renderStep = () => {
    switch (step) {
      case 'intro':
        return <IntroSim onCompletion={handleIntroCompletion} />;
      case 'welcome':
        if (userData) {
          return (
            <InterviewSim 
              userName={userData.nombre} 
              initialTopic={userData.sector}
              onStartSimulation={handleStartSimulation} 
            />
          );
        }
        return null; // Or a loading/error state
      case 'simulation':
        return <InterviewSimApp 
                  topic={topic} 
                  onFinish={handleSimulationFinish} 
                  userData={userData}
                  setUserData={setUserData}
                />;
      case 'thankyou':
        return <InterviewThankYou onRestart={handleRestart} />;
      default:
        return <IntroSim onCompletion={handleIntroCompletion} />;
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      {renderStep()}
    </main>
  );
}
