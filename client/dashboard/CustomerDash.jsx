import React from 'react';
import StampCard from './StampCard';
import './CustomerDash.css';
import { useState, useEffect } from 'react';

const handleLogOut = () => {
  fetch('http://localhost:8082/api/users/logout', { credentials: 'include' })
};

// const dummyData = [
//   {
//     businessName: 'Number 1 Tacos',
//     stars: 5,
//   },
//   {
//     businessName: 'Burrito Land',
//     stars: 0,
//   },
//   {
//     businessName: 'Dinosaur Coffee',
//     stars: 10,
//   },
//   {
//     businessName: 'Intelligentsia',
//     stars: 5,
//   },
//   {
//     businessName: 'Seafood Boil',
//     stars: 0,
//   },
//   {
//     businessName: 'Yumyum Coffee',
//     stars: 10,
//   },
//   {
//     businessName: 'Be For Reals Poke',
//     stars: 5,
//   },
//   {
//     businessName: 'King Pizza',
//     stars: 0,
//   },
//   {
//     businessName: 'Dinosaur LAST',
//     stars: 10,
//   },
// ];

function CustomerDash() {
  const [business, setBusiness] = useState([]);
  const [customerName, setName] = useState("");

  async function getBusinessList() {
    try {
      console.log('IS THIS THE PROBLEM')
        const response = await fetch(`http://localhost:8082/api/users/dashboard`, {credentials: 'include'});
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setBusiness(result);
        
        console.log('businesses: ', result);
    } catch (err) {
        alert("Error fetching customers from backend.");
    }
  }
  
  useEffect(() => {
    getBusinessList();
  }, []);

  useEffect(()=>{
if(business[0]){
  setName(business[0].customer_name)
}
  }, [business]);

  console.log('business state: ', business);
  
  return (
    <div className='customer-dash-container'>
      <div className='cust-nav'>
        <h2 className='welcome'>Welcome, {customerName}!</h2>
        <button onClick={handleLogOut}>Log Out</button>
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
