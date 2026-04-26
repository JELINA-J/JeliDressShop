import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const navigate = useNavigate();

  const [activeForm, setActiveForm] = useState('login');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handler for register with auto-login
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Step 1: Register
      const registerRes = await axios.post(
        'https://jelidressshop-1-1.onrender.com/api/auth/register',
        {
          name: registerUsername,
          email: registerEmail,
          password: registerPassword
        }
      );

      console.log('Registration successful:', registerRes.data);
      
      // Step 2: Auto login
      const loginRes = await axios.post(
        'https://jelidressshop-1-1.onrender.com/api/auth/login',
        {
          identifier: registerEmail,
          password: registerPassword
        }
      );

      console.log('Auto-login successful:', loginRes.data);
      
      // Step 3: Store credentials
      if (loginRes.data.token) {
        localStorage.setItem('token', loginRes.data.token);
      }
      
      const username = loginRes.data.username || loginRes.data.name || registerUsername;
      localStorage.setItem('username', username);
      
      // Step 4: Verify storage
      console.log('Token in localStorage:', localStorage.getItem('token'));
      console.log('Username in localStorage:', localStorage.getItem('username'));
      
      setMessage('Registered and logged in successfully! 🎉');
      
      // Step 5: Navigate
      setTimeout(() => {
        navigate('/home');
      }, 100);
      
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      setMessage(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for login
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
      
      console.log('Login response:', res.data);
      
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      
      const username = res.data.username || res.data.name || loginIdentifier;
      localStorage.setItem('username', username);
      
      console.log('Login - Token stored:', !!localStorage.getItem('token'));
      
      setMessage(`Welcome back, ${username}!`);
      
      setTimeout(() => {
        navigate('/home');
      }, 100);
      
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setMessage('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="Account-page">
      <div className="row">
        <div className="col-2">
          {message && <p style={{ color: message.includes('failed') ? 'red' : 'green' }}>{message}</p>}
          <img src="images/loginimage.png" style={{ width: '115%' }} alt="Login" />
        </div>

        <div className="col-2">
          <div className="form-container">
            <div className="form-btn">
              <span
                onClick={() => setActiveForm('login')}
                style={{ color: activeForm === 'login' ? '#088178' : 'rgb(20, 19, 19)', cursor: 'pointer' }}
              >
                Login
              </span>
              <span
                onClick={() => setActiveForm('register')}
                style={{ color: activeForm === 'register' ? '#088178' : 'rgb(20, 19, 19)', cursor: 'pointer' }}
              >
                Register
              </span>
              <hr
                id="indicator"
                style={{
                  transform: activeForm === 'login' ? 'translateX(50px)' : 'translateX(150px)',
                  transition: 'transform 0.5s'
                }}
              />
            </div>

            {/* Login form */}
            <form onSubmit={handleLogin} id="loginform" style={{
              transform: activeForm === 'login' ? 'translateX(300px)' : 'translateX(0px)',
              transition: 'transform 0.5s'
            }}>
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
              <button type="submit" className="login-btn" disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Login'}
              </button>
              <a href="#">Forget Password</a>
            </form>

            {/* Register form */}
            <form onSubmit={handleRegister} id="regform" style={{
              transform: activeForm === 'register' ? 'translateX(0px)' : 'translateX(300px)',
              transition: 'transform 0.5s'
            }}>
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
              <button type="submit" className="login-btn" disabled={isLoading}>
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
