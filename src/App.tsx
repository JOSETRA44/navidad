import { useState } from 'react';
import { CountdownTimer } from './components/CountdownTimer';
import { TimeCapsuleForm } from './components/TimeCapsuleForm';
import { ViewCapsules } from './components/ViewCapsules';
import { SnowEffect } from './components/SnowEffect';
import { Clock, Mail, Archive } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'countdown' | 'create' | 'view'>('countdown');
  const [currentUsername, setCurrentUsername] = useState<string>('');

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f1f5f9] relative">
      <SnowEffect />
      
      <div className="container mx-auto px-4 py-16 relative z-10 max-w-6xl">
        <header className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full mb-6">
            <Clock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl mb-3 bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
            New Year 2026
          </h1>
          <p className="text-slate-400 text-lg">Countdown & Time Capsule</p>
        </header>
        
        {/* Navigation */}
        <nav className="flex justify-center gap-2 mb-16">
          <button
            onClick={() => setActiveTab('countdown')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
              activeTab === 'countdown'
                ? 'bg-amber-500 text-slate-900'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            Countdown
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
              activeTab === 'create'
                ? 'bg-amber-500 text-slate-900'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Mail className="w-4 h-4" />
            Create
          </button>
          <button
            onClick={() => setActiveTab('view')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
              activeTab === 'view'
                ? 'bg-amber-500 text-slate-900'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Archive className="w-4 h-4" />
            View
          </button>
        </nav>

        {/* Content */}
        <main className="max-w-3xl mx-auto">
          {activeTab === 'countdown' && <CountdownTimer />}
          {activeTab === 'create' && (
            <TimeCapsuleForm 
              currentUsername={currentUsername}
              setCurrentUsername={setCurrentUsername}
            />
          )}
          {activeTab === 'view' && (
            <ViewCapsules 
              currentUsername={currentUsername}
              setCurrentUsername={setCurrentUsername}
            />
          )}
        </main>
      </div>
    </div>
  );
}
