import React, { useState } from 'react';
import BusCustomerItem from './BusCustomerItem';

const BusCustomerList = ({ customers, updateVisits }) => {
  //search functionality
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = searchQuery
    ? customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.phone.toString().includes(searchQuery)
      )
    : customers;

  return (
    <section className='customer-list' style={{ marginBottom: '20px' }}>
      <h2>Customer List</h2>
      <input
        type='text'
        placeholder='Search by name or phone number'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
      />
      <div
        className='customer-box'
        style={{
          height: '200px',
          overflowY: 'scroll',
          border: '1px solid #ccc',
          padding: '10px',
        }}
      >
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
