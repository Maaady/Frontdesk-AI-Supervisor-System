import { useState } from 'react';
import { Phone, Bot } from 'lucide-react';
import { createHelpRequest } from '../services/helpRequestService';
import { searchKnowledgeBase } from '../services/knowledgeBaseService';

const BUSINESS_INFO = {
  name: 'Serenity Salon & Spa',
  hours: 'Monday-Friday: 9 AM - 8 PM, Saturday: 10 AM - 6 PM, Sunday: Closed',
  services: ['Haircuts', 'Hair Coloring', 'Manicures', 'Pedicures', 'Facials', 'Massages'],
  address: '123 Main Street, Anytown, USA',
  phone: '(555) 123-4567',
};

export default function AgentSimulator() {
  const [callerName, setCallerName] = useState('');
  const [callerPhone, setCallerPhone] = useState('');
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState<Array<{ role: 'agent' | 'caller' | 'system'; text: string }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartCall = () => {
    if (!callerName || !callerPhone) {
      alert('Please enter caller name and phone number');
      return;
    }

    setConversation([
      {
        role: 'agent',
        text: `Hello, thank you for calling ${BUSINESS_INFO.name}! My name is Aria, your AI assistant. How can I help you today?`,
      },
    ]);
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setIsProcessing(true);
    setConversation((prev) => [...prev, { role: 'caller', text: question }]);

    const knownAnswer = await checkKnownQuestions(question);

    if (knownAnswer) {
      setConversation((prev) => [
        ...prev,
        { role: 'agent', text: knownAnswer },
      ]);
      setQuestion('');
      setIsProcessing(false);
      return;
    }

    const kbAnswer = await searchKnowledgeBase(question);

    if (kbAnswer) {
      setConversation((prev) => [
        ...prev,
        { role: 'agent', text: kbAnswer },
      ]);
      setQuestion('');
      setIsProcessing(false);
      return;
    }

    setConversation((prev) => [
      ...prev,
      {
        role: 'agent',
        text: "That's a great question! Let me check with my supervisor and get back to you with the most accurate information. Can you give me a moment?",
      },
    ]);

    const request = await createHelpRequest(callerName, callerPhone, question);

    if (request) {
      setConversation((prev) => [
        ...prev,
        {
          role: 'system',
          text: `Request escalated to supervisor. Request ID: ${request.id}`,
        },
        {
          role: 'agent',
          text: "I've sent your question to my supervisor. We'll text you back shortly with an answer. Is there anything else I can help you with?",
        },
      ]);
    } else {
      setConversation((prev) => [
        ...prev,
        {
          role: 'agent',
          text: "I apologize, but I'm having trouble creating your request. Please try calling back in a moment.",
        },
      ]);
    }

    setQuestion('');
    setIsProcessing(false);
  };

  const checkKnownQuestions = async (q: string): Promise<string | null> => {
    const lowerQ = q.toLowerCase();

    if (lowerQ.includes('hour') || lowerQ.includes('open')) {
      return `Our hours are ${BUSINESS_INFO.hours}.`;
    }

    if (lowerQ.includes('address') || lowerQ.includes('location') || lowerQ.includes('where')) {
      return `We're located at ${BUSINESS_INFO.address}.`;
    }

    if (lowerQ.includes('phone') || lowerQ.includes('number') || lowerQ.includes('call')) {
      return `You can reach us at ${BUSINESS_INFO.phone}.`;
    }

    if (lowerQ.includes('service') || lowerQ.includes('offer') || lowerQ.includes('do you do')) {
      return `We offer: ${BUSINESS_INFO.services.join(', ')}. Would you like to know more about any specific service?`;
    }

    return null;
  };

  const handleReset = () => {
    setConversation([]);
    setCallerName('');
    setCallerPhone('');
    setQuestion('');
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="w-7 h-7" />
            AI Agent Simulator
          </h1>
          <p className="text-blue-100 mt-1">{BUSINESS_INFO.name}</p>
        </div>

        <div className="p-6">
          {conversation.length === 0 ? (
            <div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">Business Information</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>Name:</strong> {BUSINESS_INFO.name}</p>
                  <p><strong>Hours:</strong> {BUSINESS_INFO.hours}</p>
                  <p><strong>Services:</strong> {BUSINESS_INFO.services.join(', ')}</p>
                  <p><strong>Address:</strong> {BUSINESS_INFO.address}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Caller Name:
                  </label>
                  <input
                    type="text"
                    value={callerName}
                    onChange={(e) => setCallerName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number:
                  </label>
                  <input
                    type="tel"
                    value={callerPhone}
                    onChange={(e) => setCallerPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <button
                  onClick={handleStartCall}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Start Call
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="bg-slate-50 rounded-lg p-4 mb-4 max-h-96 overflow-y-auto">
                {conversation.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`mb-3 ${
                      msg.role === 'caller' ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div
                      className={`inline-block max-w-[80%] rounded-lg px-4 py-2 ${
                        msg.role === 'agent'
                          ? 'bg-blue-600 text-white'
                          : msg.role === 'caller'
                          ? 'bg-slate-300 text-slate-900'
                          : 'bg-amber-100 text-amber-900 text-sm'
                      }`}
                    >
                      {msg.role !== 'system' && (
                        <p className="text-xs font-semibold mb-1 opacity-75">
                          {msg.role === 'agent' ? 'AI Agent' : 'Caller'}
                        </p>
                      )}
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ask a Question:
                  </label>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAskQuestion();
                      }
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Type your question..."
                    disabled={isProcessing}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAskQuestion}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                    disabled={isProcessing || !question.trim()}
                  >
                    {isProcessing ? 'Processing...' : 'Ask Question'}
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
                  >
                    End Call
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
