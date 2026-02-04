import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Factory, Lock, User } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Artificial delay for smooth feel
    await new Promise(r => setTimeout(r, 600));

    const res = await login(username, password);
    if (!res.success) {
      setError(res.error || 'Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-app)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(34,211,238,0.4)] mb-6"
          >
            <Factory className="text-black w-8 h-8" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome Back</h1>
          <p className="text-[var(--color-text-secondary)]">Sign in to VELORA NEON POS</p>
        </div>

        <Card className="border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Username"
              icon={User}
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="p-3 rounded-lg bg-red-950/30 border border-red-900/50 text-red-400 text-sm font-medium flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5 font-bold tracking-wide"
              loading={loading}
            >
              SIGN IN
            </Button>
          </form>
        </Card>

        <div className="mt-8 text-center text-xs text-zinc-600">
          <p>&copy; {new Date().getFullYear()} VELORA Paint Factory</p>
          <p className="mt-1">Industrial ERP v3.0</p>
        </div>
      </motion.div>
    </div>
  );
}
