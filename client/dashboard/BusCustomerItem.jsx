import React from 'react';

const BusCustomerItem = ({ customer, updateVisits }) => {
  return (
    <div className='customer-item'>
      <div>
        <strong>Name: </strong>
        {customer.name}
      </div>
      <div>
        <strong>Phone #: </strong>
        {customer.phone}
      </div>
      <div>
        <strong>Stars:</strong> {customer.num_of_visits}
        <button
          onClick={() => updateVisits(customer.phone, 1)} // Updated this from customer.id => customer.phone
        >
          +
        </button>
        <button
          onClick={() => updateVisits(customer.phone, -1)}  // Updated this from customer.id => customer.phone
        >
          -
        </button>
      </div>
    </div>
  );
};

export default BusCustomerItem;
