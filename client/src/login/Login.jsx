import react from 'react';
import { useState } from 'react';

function Login() {
  const [username, setUser] = useState('');
  const [password, setPass] = useState('');

  function submit() {
    fetch('http://localhost:8082/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      redirect: 'follow',
      mode: 'cors',
      body: JSON.stringify({ username: username, password: password }),
    });
  }

  return (
    <div>
      <h4>Welcome back!</h4>
      <div>
        <input
          type='text'
          id='loginBox'
          placeholder='Username'
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
        <button>Register</button>
      </div>
    </div>
  );
}

export default Login;
