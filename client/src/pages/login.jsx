import React, { useState } from 'react';
import axios from 'axios';

const AuthPage = () => {
  const [activeForm, setActiveForm] = useState('login');

  // States for register inputs
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  // States for login inputs
  const [loginUsername, setLoginUsername] = useState('');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

const [message, setMessage] = useState('');


  // Handler for register
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name: registerUsername,
        email: registerEmail,
        password: registerPassword
      });
      console.log('✅ Registered:', res.data);
          setMessage('Registered successfully! 🎉.Login to continue');

    } catch (err) {
      console.error('❌ Register error:', err.response ? err.response.data : err.message);
          setMessage('Registration failed. Please try again.');

    }
  };

  // Handler for login (implement your backend route later)
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        identifier: loginIdentifier,
        password: loginPassword
      });
      console.log('🔑 Login identifier:', loginIdentifier);
      console.log('🔑 Login password:', loginPassword);

      console.log(res.data);
      //alert(`Welcome back, ${res.data.username}!`);
      localStorage.setItem('username', res.data.username);
      window.location.href = '/home';
    } catch (err) {
      console.error('❌ Login error:', err.response ? err.response.data : err.message);
    setMessage('Login failed. Please check your credentials.');
    }
  };
  return (
    <div className="Account-page">
      <div className="row">
        <div className="col-2">
{message && <p style={{ color: 'green' }}>{message}</p>}

          <img src="images/loginimage.png" style={{ width: '115%' }} alt="Login" />
        </div>

        <div className="col-2">
          <div className="form-container">
            <div className="form-btn">
              <span
                onClick={() => setActiveForm('login')}
                style={{ color: activeForm === 'login' ? '#088178' : 'rgb(20, 19, 19)' }}
              >
                Login
              </span>
              <span
                onClick={() => setActiveForm('register')}
                style={{ color: activeForm === 'register' ? '#088178' : 'rgb(20, 19, 19)' }}
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
            <form
              onSubmit={handleLogin}
              id="loginform"
              style={{
                transform: activeForm === 'login' ? 'translateX(300px)' : 'translateX(0px)',
                transition: 'transform 0.5s'
              }}
            >
              <input
                type="text"
                name="identifier"
                placeholder="Username or Email"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />

              <button type="submit" className="login-btn">Login</button>
              <a href="#">Forget Password</a>
            </form>

            {/* Register form */}
            <form
              onSubmit={handleRegister}
              id="regform"
              style={{
                transform: activeForm === 'register' ? 'translateX(0px)' : 'translateX(300px)',
                transition: 'transform 0.5s'
              }}
            >
              <input
                type="text"
                name="identifier"
                placeholder="Username"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
              <button type="submit" className="login-btn">Register</button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
