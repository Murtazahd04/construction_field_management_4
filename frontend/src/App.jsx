// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { Toaster } from 'react-hot-toast';

// Page Imports
import Login from './pages/Login';
import Enquiry from './pages/Enquiry';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import Projects from './pages/Projects'; // <--- New Import for Member 2
import Dashboard from './pages/Dashboard'; // <--- Add this import
import Materials from './pages/Materials'; // <--- Import
function App() {
  return (
    <Provider store={store}>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register-enquiry" element={<Enquiry />} />
          
          {/* Admin Routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-panel" element={<AdminPanel/>} />
          
          {/* User/Member 2 Routes */}
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/projects" element={<Projects />} /> {/* <--- New Route */}
          <Route path="/materials" element={<Materials />} />
          {/* Placeholder for Project Details (Coming next) */}
          <Route path="/projects/:id" element={<Projects/>} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;