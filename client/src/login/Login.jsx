import react from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import goatLogo from '../assets/goatlogo.svg';

function Login() {
    const [username, setUser] = useState('');
    const [password, setPass] = useState('');
    const navigate = useNavigate();

  async function submit() {
    const response = await fetch('http://localhost:8082/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      redirect: 'follow',
      mode: 'cors',
      body: JSON.stringify({ phone: username, password: password }),
    });
    if (!response.ok) {
      throw new Error(`Login error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (data.usertype === "business") {
      navigate(`/business/${data.username}`);
    } else {
      navigate(`/customer/${data.username}`);
    }
  }

  return (
    <div className='login-container'>
      <div className='goat-logo'>
        <img id="rewardsgoat" src={goatLogo} />
      </div>

      <h4>Rewards Goat</h4>
      <h7>Login to Receive Rewards!</h7>
      <div>
        <input
          type='text'
          id='loginBox'
          placeholder='Phone'
          onChange={(e) => setUser(e.target.value)}
        />
      </div>
      <div>
        <input
          type='password'
          id='passwordBox'
          placeholder='Password'
          onChange={(e) => setPass(e.target.value)}
        />
      </div>
      <div>
        <button onClick={submit}>Login</button>
        <button onClick={() => navigate('/register')}>Register</button>
      </div>
    </div>
  );
}

export default Login;
