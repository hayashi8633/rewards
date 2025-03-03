import React from 'react';

const BusCustomerItem = ({ customer, updateVisits }) => {
  return (
    <div style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
      <div>
        <strong>Name: </strong>
        {customer.name}
      </div>
      <div>
        <strong>Phone #: </strong>
        {customer.phone}
      </div>
      <div style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
        <strong>Points:</strong> {customer.num_of_visits}
        <button
          onClick={() => updateVisits(customer.phone, 1)} // Updated this from customer.id => customer.phone
          style={{ marginLeft: '10px' }}
        >
          +
        </button>
        <button
          onClick={() => updateVisits(customer.phone, -1)}  // Updated this from customer.id => customer.phone
          style={{ marginLeft: '10px' }}
        >
          -
        </button>
      </div>
    </div>
  );
};

export default BusCustomerItem;
