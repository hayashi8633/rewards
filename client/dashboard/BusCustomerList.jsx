import React, { useState } from 'react';
import BusCustomerItem from './BusCustomerItem';

const BusCustomerList = ({ customers, updateVisits }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = searchQuery
    ? customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.phone.toString().includes(searchQuery)
      )
    : customers;

  return (
    <section className='customer-list'>
      <h2>Customer List</h2>
      <input
        type='text'
        placeholder='Search by name or phone number'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className='customer-box'>
        <div className='customer-table-header'>
          <div>Name</div>
          <div>Phone Number</div>
          <div>Stars</div>
          <div>Actions</div>
        </div>
        {customers.length === 0 ? (
          <p>Add a customer to get started!</p>
        ) : filteredCustomers.length === 0 ? (
          <p>No customers found</p>
        ) : (
          filteredCustomers.map((customer) => (
            <BusCustomerItem
              key={customer.id}
              customer={customer}
              updateVisits={updateVisits}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default BusCustomerList;
