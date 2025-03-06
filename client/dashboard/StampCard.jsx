import React, { useState, useEffect } from 'react';
import './StampCard.css';
import starFilled from '../src/assets/star-filled.svg';
import starUnfilled from '../src/assets/star-unfilled.svg';

// 🪽 🪽 🪽 🪽 🪽 Wing's code begins 🪽 🪽 🪽 🪽 🪽
// { business_name: businessName, amount: -10, phone: phone }

const handleRedeem = async (
  businessName,
  phone,
  onRedeem,
  setStars,
  rewardLimit
) => {
  const requestBody = {
    amount: rewardLimit * -1,
    phone: phone,
    business_name: businessName,
  };

  try {
    const response = await fetch('http://localhost:8082/api/bus/removeStar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const data = await response.json();
    console.log('Redeem API Response:', data);

    setStars(data.stars); // Update local state
    onRedeem(businessName, data.stars); // Update parent state (CustomerDash)
  } catch (error) {
    console.error('Error processing redemption:', error);
  }
};

function StampCard({ businessName, stars, phone, onRedeem, rewards }) {
  const totalStamps = 10;
  const [starsState, setStars] = useState(stars);
  const [message, setMessage] = useState('');
  const [activeReward, setReward] = useState('Redeem');
  const [rewardLimit, setLimit] = useState(10);

  useEffect(() => {
    const logStarsMessage = (starsState) => {
      if (starsState < 10) {
        setMessage('Stars until your next reward!');
      } else {
        setMessage(`You have ${starsState} stars!`);
      }
    };

    logStarsMessage(starsState);
  }, [starsState]);

  useEffect(() => {
    setStars(stars);
  }, [stars]);

  useEffect(() => {
    if (Array.isArray(rewards)) {
      for (let i = 0; i < rewards.length; i++) {
        if (stars > rewards[i].num_of_stars) {
          setReward(`Redeem your ${rewards[i].type}`);
          setLimit(rewards[i].num_of_stars);
        }
      }
    }
  }, [rewards]);

  return (
    <div className='stamp-cards'>
      <p className='stamp-title'>{businessName}</p>
      <div className='stamps-container'>
        <div className='stamps'>
          {Array.from({ length: totalStamps }).map((_, index) => (
            <img
              key={index}
              src={stars > index ? starFilled : starUnfilled}
              alt='star icon'
            />
          ))}
        </div>
        <div className='redeem-container'>
          {stars >= rewardLimit ? (
            <>
              <button
                className='redeem-btn'
                onClick={() =>
                  handleRedeem(
                    businessName,
                    phone,
                    onRedeem,
                    setStars,
                    rewardLimit
                  )
                }
              >
                {activeReward}
              </button>
              <p className='stars-met'>You have {starsState} stars!</p>
            </>
          ) : (
            <p className='stars-needed'>{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StampCard;

// function StampCard(props) {
//   const totalStamps = 10;
//   console.log('stars: ', props.stars);
//   return (
//     <div className='stamp-cards'>
//       <p className='stamp-title'>{props.businessName}</p>
//       <div className='stamps-container'>
//         <div className='stamps'>
//           {Array.from({ length: totalStamps }).map((_, index) => (
//             <img
//               src={props.stars > index ? starFilled : starUnfilled}
//               alt='star icon svg'
//             />
//           ))}
//         </div>
//         <div className='redeem-container'>
//           {props.stars == 10 ? (
//             <button className='redeem-btn' onClick={()=>handleRedeem(props.businessName, props.stars, props.customerName)}>
//               Redeem
//             </button>
//           ) : (
//             <p className='stars-needed'>
//               {10 - props.stars} stars until your next reward!
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default StampCard;
