//imports
import React from 'react';
import { useNavigate } from 'react-router-dom';

const handleLogOut = (navigate) => {
  fetch('http://localhost:8082/api/users/logout', { credentials: 'include' });
  navigate('/');
};

const BusManageRewards = ({ newReward, setNewReward, addReward ,rewards, deleteReward}) => {
  const navigate = useNavigate();


  console.log(rewards)
  return (
    <section className='manage-rewards'>
      <h2>Rewards</h2>

     <div className="rewards-container">
     <input className='rewards-count'
      type='number'
      placeholder='count'
      value={newReward.num_of_stars}
      onChange={(e) =>
        setNewReward({ ...newReward, num_of_stars: parseInt(e.target.value) })}
    />
      <input className='rewards-count'
      type='text'
      placeholder='Reward Type'
      value={newReward.type}
      onChange={(e) =>
        setNewReward({ ...newReward, type: e.target.value })}
    />
      <button id="addReward" className='controls' onClick={addReward}>
        Add
      </button>
     </div>
      <ul>
       {Array.isArray(rewards) && rewards.map((reward, key)=>(
         <div key={key} className='rewards-container'>
         <p>{reward.num_of_stars} stars</p>
         <span>=</span>
         <p>{reward.type}</p>
         <button id="deleteReward" className='controls'onClick={()=>deleteReward(reward)} >
        Delete
      </button>
       </div>
       ))}
      </ul>
      <button onClick={() => handleLogOut(navigate)}>Log Out</button>
    </section>
  );
};

export default BusManageRewards;
