import React, { useState } from 'react';
import './StampCard.css';
import starFilled from '../assets/star-filled.svg';
import starUnfilled from '../assets/star-unfilled.svg';


// 🪽 🪽 🪽 🪽 🪽 Wing's code begins 🪽 🪽 🪽 🪽 🪽 
// { business_name: businessName, amount: -10, phone: phone }
const handleRedeem = async (businessName, amount, phone, setStars) => {
  const requestBody = {
    amount: amount - 10, 
    phone: phone, 
    business_name: businessName,
  };
  try {
    const response = await fetch("http://localhost:8082/api/bus/removeStar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    setStars(data.amount); // Update stars in UI after successful redemption

  } catch (error) {
    console.error("Error processing redemption:", error);
  }
};

function StampCard({ businessName, stars: initialStars, phone }) {
  const totalStamps = 10;
  const [stars, setStars] = useState(initialStars);

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
          {stars >= 10 ? (
            <button
              className='redeem-btn'
              onClick={() => handleRedeem(businessName, phone, setStars)}
            >
              Redeem
            </button>
          ) : (
            <p className='stars-needed'>{10 - stars} stars until your next reward!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StampCard;


// const handleRedeem = async (businessName, stars, customer) => {
//   try {
//     // const requestBody = {
//     //   amount: amount,
//     //   phone: phone,
//     //   business_name: companyName
//     // };

//     const response = await fetch("http://localhost:8082/api/bus/addStar", {
//         method: "POST",
//         // mode: "no-cors", // Mysterious cors error- add this next time you get one and it fixes yayyy
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(requestBody)
//     });

//     if (!response) {
//         throw new Error("Network response was not ok (updateVisits)");
//     }

//     // const result = await response.json();
//     // console.log(response);
//     getCustomerList();
// } catch (error) {
//     console.error("Error submitting visits:", error);
//     // setResponseMessage("Submission failed.");
// }
// };

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
