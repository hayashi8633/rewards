//imports
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
          console.log('response: ', response);
          return response.json();
        })
        .then((data) => {
          // console.log("data,", data);
          setCustomers(data);
        });
    } catch (err) {
      alert('Error fetching customers from backend.');
    }
  }

  useEffect(() => {
    getCustomerList();
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

  return (
    <div className='dashboard'>
      <BusHeader companyName={companyName} />
      <BusAddCustomer
        newCustomer={newCustomer}
        setNewCustomer={setNewCustomer}
        addCustomer={addCustomer}
      />
      <BusCustomerList customers={customers} updateVisits={updateVisits} />
      <BusManageRewards />
    </div>
  );
};

export default BusDash;
