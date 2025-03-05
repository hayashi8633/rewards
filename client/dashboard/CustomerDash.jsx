import React from 'react';
import StampCard from './StampCard';
import './CustomerDash.css';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const handleLogOut = (navigate) => {
  fetch('http://localhost:8082/api/users/logout', { credentials: 'include' });
  navigate('/');
};

//uses cookies to get user information but should be using the customerName probably? because as is I can type "Chapman" and it will say
//hello Chapman but still display the card info for Katherine

function CustomerDash() {
  const [business, setBusiness] = useState([]);
  const { customerName } = useParams();
  const navigate = useNavigate();

  async function getBusinessList() {
    try {
      const response = await fetch(
        `http://localhost:8082/api/users/dashboard?customerName=${customerName}`, //slash customername?
        { credentials: 'include' }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setBusiness(result);

      console.log('businesses: ', result);
    } catch (err) {
      alert('Error fetching customers from backend.');
    }
  }

  useEffect(() => {
    getBusinessList();
  }, []);

  return (
    <div className='customer-dash-container'>
      <div className='cust-nav'>
        <h2 className='welcome'>Welcome, {customerName}!</h2>
        <button onClick={() => handleLogOut(navigate)}>Log Out</button>
      </div>

      <div className='card-center'>
        <div className='stamp-cards-container'>
          {business.map((card, index) => (
            <StampCard
              key={index}
              businessName={card.business_name}
              stars={card.num_of_visits}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CustomerDash;
