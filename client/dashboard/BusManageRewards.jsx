//imports
import React from 'react';
import { useNavigate } from 'react-router-dom';

const handleLogOut = (navigate) => {
  fetch('http://localhost:8082/api/users/logout', { credentials: 'include' });
  navigate('/');
};

const BusManageRewards = () => {
  const navigate = useNavigate();
  return (
    <section className='manage-rewards'>
      <h2>Rewards</h2>
      <p style={{ color: 'red' }}>Working on this feature!</p>
      <button onClick={() => handleLogOut(navigate)}>Log Out</button>
    </section>
  );
};

export default BusManageRewards;
