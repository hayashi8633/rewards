import React from 'react';

const BusCustomerItem = ({ customer, updateVisits }) => {
  return (
    <div className='customer-item'>
      <div>{customer.name}</div>
      <div>{customer.phone}</div>
      <div>{customer.num_of_visits}</div>
      <div className='actions'>
        <button onClick={() => updateVisits(customer.phone, 1)}>+</button>
        <button onClick={() => updateVisits(customer.phone, -1)}>-</button>
      </div>
    </div>
  );
};

export default BusCustomerItem;