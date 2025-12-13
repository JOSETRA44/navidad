import { useState } from 'react';
import { Lock, User, MessageSquare, Calendar, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { createCapsule } from '../lib/api';

interface Props {
  currentUsername: string;
  setCurrentUsername: (username: string) => void;
}

export function TimeCapsuleForm({ currentUsername, setCurrentUsername }: Props) {
  const [formData, setFormData] = useState({
    username: currentUsername,
    password: '',
    message: '',
    openDate: '',
    openTime: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const openDateTime = new Date(`${formData.openDate}T${formData.openTime}`);
      
      if (openDateTime <= new Date()) {
        setErrorMessage('Open date must be in the future');
        setStatus('error');
        return;
      }

      await createCapsule(
        formData.username,
        formData.password,
        formData.message,
        openDateTime.toISOString()
      );

      setCurrentUsername(formData.username);
      setStatus('success');
      setFormData({
        username: formData.username,
        password: '',
        message: '',
        openDate: '',
        openTime: '',
      });

      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Error creating capsule:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to create capsule');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-10 border border-slate-700/50">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full mb-6">
          <MessageSquare className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl mb-3 text-amber-400">Time Capsule</h2>
        <p className="text-slate-400">Create a message for your future self</p>
      </div>

      {status === 'success' && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mb-6 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <p className="text-emerald-400">Capsule created successfully</p>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 text-slate-300 text-sm uppercase tracking-wider">
            Username
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              placeholder="Enter your username"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-slate-300 text-sm uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              placeholder="Create a secure password"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-slate-300 text-sm uppercase tracking-wider">
            Message
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-slate-500" />
            <textarea
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={6}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
              placeholder="Write your message to the future..."
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-slate-300 text-sm uppercase tracking-wider">
              Open Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="date"
                required
                min={today}
                value={formData.openDate}
                onChange={(e) => setFormData({ ...formData, openDate: e.target.value })}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-slate-300 text-sm uppercase tracking-wider">
              Open Time
            </label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="time"
                required
                value={formData.openTime}
                onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 py-4 rounded-lg transition-all flex items-center justify-center gap-2 mt-8"
        >
          <Send className="w-5 h-5" />
          {status === 'loading' ? 'Creating...' : 'Create Time Capsule'}
        </button>
      </form>
    </div>
  );
}
