import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const navigate = useNavigate();

  const [activeForm, setActiveForm] = useState('login');

  // Register states
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  // Login states
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ================= REGISTER =================
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Step 1: Register
      await axios.post(
        'https://jelidressshop-1-1.onrender.com/api/auth/register',
        {
          name: registerUsername,
          email: registerEmail,
          password: registerPassword
        }
      );

      // Step 2: Auto Login
      const loginRes = await axios.post(
        'https://jelidressshop-1-1.onrender.com/api/auth/login',
        {
          identifier: registerEmail,
          password: registerPassword
        }
      );

      // Step 3: Store token & username
      localStorage.setItem('token', loginRes.data.token);

      const username =
        loginRes.data.username ?? registerUsername;

      localStorage.setItem('username', username);

      setMessage('Registered and logged in successfully! 🎉');

      // Step 4: Navigate
      navigate('/home');

    } catch (err) {
      console.error('Register error:', err.response?.data || err.message);
      setMessage(err.response?.data?.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(
        'https://jelidressshop-1-1.onrender.com/api/auth/login',
        {
          identifier: loginIdentifier,
          password: loginPassword
        }
      );

      localStorage.setItem('token', res.data.token);

      const username =
        res.data.username ?? loginIdentifier;

      localStorage.setItem('username', username);

      setMessage(`Welcome back, ${username}! 🎉`);

      navigate('/home');

    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setMessage('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="Account-page">
      <div className="row">

        <div className="col-2">
          {message && (
            <p style={{ color: message.includes('failed') ? 'red' : 'green' }}>
              {message}
            </p>
          )}
          <img
            src="images/loginimage.png"
            style={{ width: '115%' }}
            alt="Login"
          />
        </div>

        <div className="col-2">
          <div className="form-container">

            {/* Toggle Buttons */}
            <div className="form-btn">
              <span
                onClick={() => setActiveForm('login')}
                style={{
                  color: activeForm === 'login' ? '#088178' : '#000',
                  cursor: 'pointer'
                }}
              >
                Login
              </span>

              <span
                onClick={() => setActiveForm('register')}
                style={{
                  color: activeForm === 'register' ? '#088178' : '#000',
                  cursor: 'pointer'
                }}
              >
                Register
              </span>

              <hr
                style={{
                  transform:
                    activeForm === 'login'
                      ? 'translateX(50px)'
                      : 'translateX(150px)',
                  transition: '0.5s'
                }}
              />
            </div>

            {/* LOGIN FORM */}
            <form
              onSubmit={handleLogin}
              style={{
                transform:
                  activeForm === 'login'
                    ? 'translateX(300px)'
                    : 'translateX(0px)',
                transition: '0.5s'
              }}
            >
              <input
                type="text"
                placeholder="Username or Email"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                required
                disabled={isLoading}
              />

              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                disabled={isLoading}
              />

              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Login'}
              </button>
            </form>

            {/* REGISTER FORM */}
            <form
              onSubmit={handleRegister}
              style={{
                transform:
                  activeForm === 'register'
                    ? 'translateX(0px)'
                    : 'translateX(300px)',
                transition: '0.5s'
              }}
            >
              <input
                type="text"
                placeholder="Username"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
                required
                disabled={isLoading}
              />

              <input
                type="email"
                placeholder="Email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
                disabled={isLoading}
              />

              <input
                type="password"
                placeholder="Password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
                disabled={isLoading}
              />

              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Register'}
              </button>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
