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
//uses cookies to get user information but should be using the customerName probably? because as is I can type "Chapman" and it will say
//hello Chapman but still display the card info for Katherine

function CustomerDash() {
  const [business, setBusiness] = useState('');
  const [rewardObj, updateRewards] = useState({});
  const { customerName } = useParams();
  const navigate = useNavigate();

  async function getBusinessList() {
    try {
      const response = await fetch(
        `http://localhost:8082/api/users/dashboard?customerName=${customerName}`,
        { credentials: 'include' }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      if (!Array.isArray(result)) {
        // check if result is an array, if not, keep user on their page
        // navigate('/access-denied'); // go to access denied page
        // frontend redirect if user tries to go to another user's page
        console.log('NAVIGATING BACK TO USER PAGE');
        navigate(-1); // send user back to previous page
        alert('Access Denied'); // alert user
      }
      setBusiness(result);

      console.log('businesses: ', result);
    } catch (err) {
      console.log('Error fetching customers from backend.');
    }
  }

  function getRewards(businessName) {
    // const response = await
    console.log('getting rewards for: ', businessName);
    fetch(`http://localhost:8082/api/users/rewards/${businessName}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((result) => {
        console.log('get rewards result: ', result);
        const newRewards = {};
        newRewards[businessName] = result;
        // console.log('REWARD OBJECT', rewardObj);
        console.log('NEW REWARDS RECEVIED', newRewards);

        const update = Object.assign({}, rewardObj, newRewards); //...rewardObj, newRewards };
        console.log('update! ', update);

        // updateRewards({ ...rewardObj, [business]: result });
        // updateRewards(newRewards);
        updateRewards(update);
      });
    // const result = await response.json();
    // console.log('get rewards result: ', result);
    // // updateRewards(Object.assign({}, rewardObj, { [business]: result }));
    // updateRewards({ ...rewardObj, [business]: result });
    // console.log('rewards object: ', rewardObj);
  }
  // Wing's added code:
  const updateStars = (businessName, newStars) => {
    setBusiness(
      (
        prevBusiness // prevBusiness contain's the most recent state
      ) =>
        prevBusiness.map((b) =>
          b.business_name === businessName
            ? { ...b, num_of_visits: newStars }
            : b
        )
    );
  };
  // Wing's code ends

  useEffect(() => {
    getBusinessList();
  }, []);

  useEffect(() => {
    if (Array.isArray(business)) {
      business.map((card) => {
        getRewards(card.business_name);
      });
    }
  }, [business]);

  useEffect(() => {
    console.log('rewardObj! ', rewardObj);
  }, [rewardObj]);

  return (
    <div className='customer-dash-container'>
      {Array.isArray(business) ? (
        <>
          <div className='cust-nav'>
            <h2 className='welcome'>Welcome, {customerName}! </h2>
            <button className='logout' onClick={() => handleLogOut(navigate)}>
              Log Out
            </button>
          </div>

          <div className='card-center'>
            <div className='stamp-cards-container'>
              {business.map((card, index) => (
                <StampCard
                  key={index}
                  businessName={card.business_name}
                  stars={card.num_of_visits}
                  phone={card.phone} // Wing's added code
                  onRedeem={updateStars} // Wing's added code
                  rewards={rewardObj[card.business_name]}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        'Access Denied'
      )}
    </div>
  );
}

export default CustomerDash;
