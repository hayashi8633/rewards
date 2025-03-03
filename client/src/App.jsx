import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BusinessDashboard from '../dashboard/BusDash';
import './App.css';

function App() {
  return (
    <div className='App'>
        <Router>
          <Routes>
              <Route path="/" element={<BusinessDashboard />} />
              <Route path="/business/:businessName" element={<BusinessDashboard />} />
          </Routes>
        </Router>
    </div>
  );
}

export default App;
