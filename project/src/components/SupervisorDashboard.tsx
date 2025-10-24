import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { HelpRequest } from '../lib/supabase';
import { getPendingRequests, getAllRequests, respondToRequest, checkExpiredRequests } from '../services/helpRequestService';

export default function SupervisorDashboard() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');
  const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRequests();
    checkExpiredRequests();

    const interval = setInterval(() => {
      loadRequests();
      checkExpiredRequests();
    }, 10000);

    return () => clearInterval(interval);
  }, [filter]);

  const loadRequests = async () => {
    const data = filter === 'pending'
      ? await getPendingRequests()
      : await getAllRequests();
    setRequests(data);
  };

  const handleSubmitResponse = async () => {
    if (!selectedRequest || !response.trim()) return;

    setLoading(true);
    const success = await respondToRequest(selectedRequest.id, response);

    if (success) {
      setResponse('');
      setSelectedRequest(null);
      await loadRequests();
    }
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'unresolved':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-slate-800 text-white p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="w-7 h-7" />
            Supervisor Dashboard
          </h1>
          <p className="text-slate-300 mt-1">Manage AI agent escalations</p>
        </div>

        <div className="p-6">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Pending ({requests.filter(r => r.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Requests ({requests.length})
            </button>
          </div>

          {requests.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No requests to display</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(request.status)}
                        <span className="font-semibold text-slate-900">
                          {request.caller_name}
                        </span>
                        <span className="text-slate-500 text-sm">
                          {request.caller_phone}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          request.status === 'pending'
                            ? 'bg-amber-100 text-amber-700'
                            : request.status === 'resolved'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {request.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="mb-2">
                        <p className="text-sm text-slate-600 font-medium">Question:</p>
                        <p className="text-slate-900">{request.question}</p>
                      </div>

                      {request.supervisor_response && (
                        <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-2">
                          <p className="text-sm text-green-700 font-medium">Response:</p>
                          <p className="text-green-900">{request.supervisor_response}</p>
                        </div>
                      )}

                      <div className="flex gap-4 text-xs text-slate-500 mt-2">
                        <span>Created: {formatTime(request.created_at)}</span>
                        {request.responded_at && (
                          <span>Resolved: {formatTime(request.responded_at)}</span>
                        )}
                        {request.status === 'pending' && (
                          <span className="text-amber-600">
                            Expires: {formatTime(request.expires_at)}
                          </span>
                        )}
                      </div>
                    </div>

                    {request.status === 'pending' && (
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Respond
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Respond to Request
            </h2>

            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-1">Caller:</p>
              <p className="font-medium text-slate-900">
                {selectedRequest.caller_name} ({selectedRequest.caller_phone})
              </p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-1">Question:</p>
              <p className="text-slate-900">{selectedRequest.question}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Your Response:
              </label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="Type your answer here..."
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setSelectedRequest(null);
                  setResponse('');
                }}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitResponse}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                disabled={loading || !response.trim()}
              >
                {loading ? 'Submitting...' : 'Submit Response'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
