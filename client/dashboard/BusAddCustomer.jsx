//imports
import React from 'react';

const BusAddCustomer = ({ newCustomer, setNewCustomer, addCustomer }) => {
  
  return (
    <section className='add-customer' style={{ marginBottom: '20px' }}>
      <h2>Add New Customer</h2>
      <input
        type='text'
        placeholder='Phone Number'
        value={newCustomer.phone}
        onChange={(e) =>
          setNewCustomer({ ...newCustomer, phone: e.target.value })
        }
        style={{ marginRight: '10px', padding: '5px' }}
      />
      <button onClick={addCustomer} style={{ padding: '5px 10px' }}>
        Add Customer
      </button>
    </section>
  );
};

export default BusAddCustomer;
