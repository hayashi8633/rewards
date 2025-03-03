//imports
import React, { useState } from 'react';
import BusHeader from './BusHeader';
import BusAddCustomer from './BusAddCustomer';
import BusCustomerList from './BusCustomerList';
import BusManageRewards from './BusManageRewards';

//http://localhost:8082/api/users/login

const BusDash = () => {
  //test customer list
  const testCustomerList = [
    {
      id: 1,
      name: 'Chapman',
      phone: 111,
      num_of_visits: 1,
    },
    {
      id: 2,
      name: 'Yihe',
      phone: 222,
      num_of_visits: 2,
    },
    {
      id: 3,
      name: 'Rachel',
      phone: 333,
      num_of_visits: 3,
    },
    {
      id: 4,
      name: 'Vicky',
      phone: 444,
      num_of_visits: 4,
    },
    {
      id: 5,
      name: 'Katherine',
      phone: 555,
      num_of_visits: 5,
    },
  ];
  //states
  const [companyName] = useState('companyName');
  const [newCustomer, setNewCustomer] = useState({ phone: '' });
  const [customers, setCustomers] = useState(testCustomerList);

  const addCustomer = () => {
    if (!newCustomer.phone.trim()) return;

    const customer = {
      id: newCustomer.id,
      phone: newCustomer.phone,
      name: newCustomer.name,
      num_of_visits: 1,
    };
    setCustomers([...customers, customer]);
    setNewCustomer({ phone: '' });
  };

  const updateVisits = (id, addend) => {
    setCustomers(
      customers.map((customer) => {
        if (customer.id === id) {
          return {
            ...customer,
            num_of_visits: customer.num_of_visits + addend,
          };
        }
        return customer;
      })
    );
  };

  return (
    <div className='dashboard' style={{ padding: '20px' }}>
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
