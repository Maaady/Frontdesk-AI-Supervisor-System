import { useState } from 'react';
import { Phone, MessageSquare, BookOpen } from 'lucide-react';
import AgentSimulator from './components/AgentSimulator';
import SupervisorDashboard from './components/SupervisorDashboard';
import KnowledgeBaseView from './components/KnowledgeBaseView';

type View = 'agent' | 'supervisor' | 'knowledge';

function App() {
  const [currentView, setCurrentView] = useState<View>('agent');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-900">
              Frontdesk AI Supervisor System
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentView('agent')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  currentView === 'agent'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Phone className="w-4 h-4" />
                AI Agent
              </button>
              <button
                onClick={() => setCurrentView('supervisor')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  currentView === 'supervisor'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Supervisor
              </button>
              <button
                onClick={() => setCurrentView('knowledge')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  currentView === 'knowledge'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Knowledge Base
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-8">
        {currentView === 'agent' && <AgentSimulator />}
        {currentView === 'supervisor' && <SupervisorDashboard />}
        {currentView === 'knowledge' && <KnowledgeBaseView />}
      </main>
    </div>
  );
}

export default App;
