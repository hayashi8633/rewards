import React from 'react';
import './StampCard.css';
import starFilled from '../src/assets/star-filled.svg';
import starUnfilled from '../src/assets/star-unfilled.svg';

const handleRedeem = () => {};

function StampCard(props) {
  const totalStamps = 10;

  return (
    <div className='stamp-cards'>
      <p className='stamp-title'>{props.businessName}</p>
      <div className='stamps-container'>
        <div className='stamps'>
          {Array.from({ length: totalStamps }).map((_, index) => (
            <img
              src={props.stars > index ? starFilled : starUnfilled}
              alt='star icon svg'
            />
          ))}
        </div>
        <div className='redeem-container'>
          {props.stars === 10 ? (
            <button className='redeem-btn' onClick={handleRedeem}>
              Redeem
            </button>
          ) : (
            <p className='stars-needed'>
              {10 - props.stars} stars until your next reward!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StampCard;
