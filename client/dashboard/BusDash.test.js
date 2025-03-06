import React from 'react';
import { jest } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';

//mock child components
jest.mock('./BusHeader', () => () => (
  <div data-testid='bus-header'>BusHeader</div>
));
jest.mock('./BusAddCustomer', () => ({ addCustomer }) => (
  <div data-testid='bus-add-customer'>
    BusAddCustomer
    <button data-testid='add-customer-button' onClick={addcustomer}>
      Add Customer
    </button>
  </div>
));
jest.mock('./BusCustomerList', () => () => (
  <div data-testid='bus-customer-list'>BusCustomerList</div>
));
jest.mock('./BusManageRewards', () => () => (
  <div data-testid='bus-manage-rewards'>BusManageRewards</div>
));
