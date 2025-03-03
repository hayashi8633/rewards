import { useState } from 'react';

function Registration() {
  const [username, updateUsername] = useState('');
  const [phoneNumber, updatePhone] = useState(0);
  const [password, updatePassword] = useState('');
  const [businessName, updateBusiness] = useState('');
  const [userType, updateUser] = useState('Customer');

  const cycle = {
    Customer: 'Business',
    Business: 'Customer',
  };

  function submit() {
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
    fetch('http://localhost:8082/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(userData),
    }).then((response) => console.log(response));
    //send user data to appropriate endpoint, either to register customer or business
    //create cookie for username & ID, or Business Name & ID
  }

  return (
    <div>
      <button onClick={() => updateUser(cycle[userType])}>
        Register As {userType}
      </button>
      {userType === 'Business' && (
        <div>
          <label htmlFor='businessName'>Business Name</label>
          <input
            type='text'
            id='businessName'
            onChange={(e) => updateBusiness(e.target.value)}
          />
        </div>
      )}
      {userType === 'Customer' && (
        <div>
          <label htmlFor='username'>Username </label>
          <input
            type='text'
            id='username'
            onChange={(e) => updateUsername(e.target.value)}
          />
        </div>
      )}
      <div>
        <label htmlFor='phoneNumber'>Phone Number </label>
        <input
          type='number'
          id='phoneNumber'
          onChange={(e) => updatePhone(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor='password'>Password </label>
        <input
          type='password'
          id='password'
          onChange={(e) => updatePassword(e.target.value)}
        />
      </div>
      <div>
        <button onClick={submit}>Submit</button>
      </div>
    </div>
  );
}

export default Registration;
