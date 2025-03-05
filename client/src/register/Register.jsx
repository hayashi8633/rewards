import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Registration() {
  const [username, updateUsername] = useState('');
  const [phoneNumber, updatePhone] = useState(0);
  const [password, updatePassword] = useState('');
  const [businessName, updateBusiness] = useState('');
  const [userType, updateUser] = useState('Customer');
  const navigate = useNavigate();

  const cycle = {
    Customer: 'Business',
    Business: 'Customer',
  };

  async function submit() {
    let userData;
    if (userType === 'Customer') {
      userData = {
        username: username,
        password: password,
        phone: phoneNumber,
        usertype: userType,
      };
    } else {
      userData = {
        username: businessName,
        password: password,
        phone: phoneNumber,
        usertype: userType,
      };
    }
    console.log(userData);
    // const response = await
    fetch('http://localhost:8082/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.usertype === 'business') {
          navigate(`../business/${data.username}`);
        } else {
          navigate(`../customer/${data.username}`);
        }
      });
  }

  return (
    <div className='register-container'>
      <h2>Register as {userType}</h2>
      {userType === 'Business' && (
        <div>
          <label htmlFor='businessName'>Business Name</label>
          <input
            type='text'
            id='businessName'
            className='inputss'
            placeholder='What is your business called?'
            onChange={(e) => updateBusiness(e.target.value)}
          />
        </div>
      )}
      {userType === 'Customer' && (
        <div>
          <label htmlFor='username'>Username </label>
          <input
            type='text'
            className='inputss'
            id='username'
            placeholder='What is your name?'
            onChange={(e) => updateUsername(e.target.value)}
          />
        </div>
      )}
      <div>
        <label htmlFor='phoneNumber'>Phone Number </label>
        <input
          type='number'
          className='inputss'
          id='phoneNumber'
          placeholder='What is your phone number?'
          onChange={(e) => updatePhone(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor='password'>Password </label>
        <input
          type='password'
          className='inputss'
          placeholder='Password here:'
          id='password'
          onChange={(e) => updatePassword(e.target.value)}
        />
      </div>
      <div>
        <button onClick={submit}>Submit</button>{' '}
        <button
          className='switch-type'
          onClick={() => updateUser(cycle[userType])}
        >
          Switch to {cycle[userType]} Registration
        </button>
      </div>
    </div>
  );
}

export default Registration;
