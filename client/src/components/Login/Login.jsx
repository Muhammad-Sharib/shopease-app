import React, { useState } from 'react';
import { useNavigate, useLocation, Link, Navigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || 'http://localhost:9999';
// Helper — where should this role go after login?
const roleHome = (role) => (role === 'admin' ? '/admin' : '/');

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect immediately based on role
  const existingUser = JSON.parse(localStorage.getItem('user'));
  if (existingUser && localStorage.getItem('auth-token')) {
    return <Navigate to={roleHome(existingUser.role)} replace />;
  }

  // Where to go after login — if redirected from a protected route use that,
  // otherwise use role-based home
  const from = location.state?.from || null;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Email and password are required.'); return; }
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('auth-token', data.token);
        localStorage.setItem('user-role', data.user.role);

        // If they were redirected here from a specific page, go back there.
        // Otherwise send them to their role-based home.
        const destination = from || roleHome(data.user.role);
        navigate(destination, { replace: true });
      } else {
        setError(data.message || 'Login failed');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f7ff 100%)' }}
    >
      {/* Decorative blob */}
      <div
        className="fixed rounded-full pointer-events-none opacity-30"
        style={{ width: 400, height: 400, background: 'radial-gradient(circle, #bae6fd, transparent)', top: '5%', right: '5%' }}
      />

      <div
        className="w-full max-w-md rounded-3xl p-8 fade-in"
        style={{ background: '#fff', boxShadow: '0 20px 60px rgba(14,165,233,0.15)', border: '1px solid #e0f2fe' }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}
          >
            S
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#1e293b' }}>Welcome Back!</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>Sign in to your ShopEase account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5" style={{ color: '#64748b' }}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-light"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wide uppercase mb-1.5" style={{ color: '#64748b' }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-light"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
              style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444' }}
            >
              ⚠ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-center py-3"
            style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>

        {/* Role hint */}
        <div
          className="mt-4 px-4 py-3 rounded-xl text-xs text-center"
          style={{ background: '#f0f9ff', color: '#64748b' }}
        >
          🛡 Admins are redirected to the Admin Panel automatically
        </div>

        <div className="divider" />
        <p className="text-center text-sm" style={{ color: '#64748b' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#0ea5e9', fontWeight: 600, textDecoration: 'none' }}>
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
