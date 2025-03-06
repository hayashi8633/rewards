//imports
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BusHeader from './BusHeader';
import BusAddCustomer from './BusAddCustomer';
import BusCustomerList from './BusCustomerList';
import BusManageRewards from './BusManageRewards';
import './BusStyles.css';

//http://localhost:8082/api/users/login

const BusDash = () => { 
  const { businessName } = useParams(); // Fetches the business name from the url (i.e. localhost:3000/business/:businessName)

  const [companyName] = useState(businessName);
  const [newCustomer, setNewCustomer] = useState({ phone: '', name: '' });
  const [customers, setCustomers] = useState([]); // Initial customers to empty list
  const [newReward, setNewReward] = useState({ num_of_stars: '', type: '' });
  const [rewards, setRewards] = useState([]); //list of rewards
  const navigate = useNavigate();

  
  async function getCustomerList() {
    try {
      console.log('IS THIS THE PROBLEM');
      fetch(
        `http://localhost:8082/api/bus/busDashboard?businessName=${companyName}`,
        { credentials: 'include' }
      )
        .then((response) => {
          if (!response) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
         
          return response.json();
        })
        .then((data) => {
          if (!Array.isArray(data)) {
            navigate('/');
          }
          // console.log("data,", data);
          setCustomers(data);
        });
    } catch (err) {
      alert('Error fetching customers from backend.');
    }
  }

  async function getRewardsList() {
    try {
      fetch(
        `http://localhost:8082/api/bus/getRewards?businessName=${companyName}`,
        { credentials: 'include' }
      )
        .then((response) => {
          if (!response) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          console.log('response: ', response);
          return response.json();
        })
        .then((data) => {
          setRewards(data);
        });
    } catch (err) {
      alert('Error fetching rewards from backend.');
    }
  }

  useEffect(() => {
    getCustomerList()
    getRewardsList() 
  }, []);

  const addCustomer = async () => {
    // This was previously adding a new customer to the dummy customer list
    // if (!newCustomer.phone.trim()) return;

    console.log('ADD CUSTOMER FUNCTION ON BUTTON');
    const requestBody = {
      name: newCustomer.name,
      phone: newCustomer.phone,
      business_name: companyName,
    };

    try {
      const response = await fetch(
        'http://localhost:8082/api/bus/addCustomer',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );
      if (!response) {
        throw new Error('Network response was not ok (addCustomer)');
      }

      getCustomerList();
    } catch (error) {
      console.error('Error submitting customer:', error);
    }
  };

  const updateVisits = async (phone, amount) => {
    const requestBody = {
      amount: amount,
      phone: phone,
      business_name: companyName,
    };

    try {
      const response = await fetch('http://localhost:8082/api/bus/addStar', {
        method: 'POST',
        // mode: "no-cors", // Mysterious cors error- add this next time you get one and it fixes yayyy
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response) {
        throw new Error('Network response was not ok (updateVisits)');
      }

      getCustomerList();
    } catch (error) {
      console.error('Error submitting visits:', error);
      // setResponseMessage("Submission failed.");
    }
  };


  //Add rewards Function
  const addReward = async () => {
    const requestBody = {
      business_name: companyName,
      num_of_stars: newReward.num_of_stars,
      type: newReward.type
    };

    try {
      const response = await fetch(
        'http://localhost:8082/api/bus/addRewards',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );
      if (!response) {
        throw new Error('Network response was not ok (addReward)');
      }

      getRewardsList();
    } catch (error) {
      console.error('Error submitting reward:', error);
    }
  };

  const deleteReward = async (reward)=> {
console.log(`from deleteReward`, reward)
    try {
      fetch(
        `http://localhost:8082/api/bus/deleteReward/businessName=${reward.business_name}/${reward.id}`,
        {   method: "DELETE",
            credentials: 'include' }
      )
        .then((response) => {
          getRewardsList() 
});
       
    } catch (err) {
      alert('Error fetching rewards from backend.');
    }
  }
  return (
    <div className='dashboard'>
      <BusHeader companyName={companyName} />
      <BusAddCustomer
        newCustomer={newCustomer}
        setNewCustomer={setNewCustomer}
        addCustomer={addCustomer}
      />
      <BusCustomerList customers={customers} updateVisits={updateVisits} />
      <BusManageRewards  
      setNewReward={setNewReward} 
      addReward={addReward} 
      deleteReward={deleteReward}
      newReward={newReward}
      rewards={rewards}
      />
    </div>
  );
};

export default BusDash;
