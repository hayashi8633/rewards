import React from 'react';
import StampCard from './StampCard';
import './CustomerDash.css';

const handleLogOut = () => {};

const dummyData = [
  {
    businessName: 'Number 1 Tacos',
    stars: 5,
  },
  {
    businessName: 'Burrito Land',
    stars: 0,
  },
  {
    businessName: 'Dinosaur Coffee',
    stars: 10,
  },
  {
    businessName: 'Intelligentsia',
    stars: 5,
  },
  {
    businessName: 'Seafood Boil',
    stars: 0,
  },
  {
    businessName: 'Yumyum Coffee',
    stars: 10,
  },
  {
    businessName: 'Be For Reals Poke',
    stars: 5,
  },
  {
    businessName: 'King Pizza',
    stars: 0,
  },
  {
    businessName: 'Dinosaur LAST',
    stars: 10,
  },
];

function CustomerDash() {
  return (
    <div className='customer-dash-container'>
      <div className='cust-nav'>
        <h2 className='welcome'>Welcome, User!</h2>
        <button onClick={handleLogOut}>Log Out</button>
      </div>

      <div className='card-center'>
        <div className='stamp-cards-container'>
          {dummyData.map((card, index) => (
            <StampCard
              key={index}
              businessName={card.businessName}
              stars={card.stars}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CustomerDash;
