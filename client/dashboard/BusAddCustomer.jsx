//imports
import React from 'react';

const BusAddCustomer = ({ newCustomer, setNewCustomer, addCustomer }) => {
  
  return (
    <section className='add-customer'>
      <h2>Add New Customer</h2>
      <input
        type='text'
        placeholder='Phone Number'
        value={newCustomer.phone}
        onChange={(e) =>
          setNewCustomer({ ...newCustomer, phone: e.target.value })
        }
      />
      <input
      type='text'
      placeholder='Name'
      value={newCustomer.name}
      onChange={(e) =>
        setNewCustomer({ ...newCustomer, name: e.target.value })
      }
    />
      <button onClick={addCustomer}>
        Add Customer
      </button>
    </section>
  );
};

export default BusAddCustomer;
