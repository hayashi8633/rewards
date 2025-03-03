import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import './App.css';
import Login from './login/Login.jsx';
import Register from './register/Register.jsx';
import BusDash from "../dashboard/BusDash";
import CustomerDash from "../dashboard/CustomerDash.jsx";

function App() {
  return (
    <div className='App'>
        <Router>
          <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/business/:businessName" element={<BusDash />} />
              <Route path="/customer/:customerName" element={<CustomerDash />} />
          </Routes>
        </Router>
    </div>
  );
}

export default App;
