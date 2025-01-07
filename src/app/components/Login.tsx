// Login.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/interceptor';
import { isAxiosError } from 'axios';
import '../scss/Login.scss';

interface LoginProps {
  onLogin: (userData: { name: string; email: string; roles: string[] }) => void;
}
const parseToken = (token: string) => {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  } catch (error) {
    console.error('Failed to parse token:', error);
    return null;
  }
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: { name: string; email: string; roles: string[] } = parseToken(token);
        const userData = {
          name: decodedToken.name,
          email: decodedToken.email,
          roles: decodedToken.roles
        };
        onLogin(userData);
        navigate('/');
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
      }
    }
  }, [navigate, onLogin]);



  const handleLogin = async () => {
    if (!email || !password) {
      setError('Username and password are required.');
      return;
    }

    try {
      const response = await axiosInstance.post(`/user/login`, { username: email, password });
      const token = response.data.token;
      localStorage.setItem('token', token);

      // Decode the token to get user data
      const parsedData = parseToken(token);
      if (!parsedData) {
        setError('Invalid token.');
        return;
      }
      const decodedToken: { name: string; email: string; roles: string[] } = parsedData;
      const userData = {
        name: decodedToken.name,
        email: decodedToken.email,
        roles: decodedToken.roles
      };
      onLogin(userData);
      navigate('/');
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          setError('Request timed out. Please try again.');
        } else if (error.response && error.response.data && error.response.data.error) {
          setError(error.response.data.error);
        } else {
          setError('An error occurred. Please try again.');
        }
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default Login;