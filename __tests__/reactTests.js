import react from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';

import App from './client/src/App';
import BusDash from './client/dashboard/BusDash';
import CustomerDash from './client/dashboard/CustomerDash';
import Login from './client/src/login/Login';
import Register from './client/src/login/Register';

describe('Unit testing React components.', () => {
  describe('Login page: ', () => {
    let login;
    beforeAll(() => {
      login = render(<Login />);
    });

    
    const phoneBox = screen.getAllByPlaceholderText('Phone');
    expect(phoneBox.tagName).toBe('input');
  });
});
