// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Enquiry from './pages/Enquiry';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register-enquiry" element={<Enquiry />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-panel" element={<AdminPanel/>} />
          <Route path="/dashboard" element={<div className="p-10">Dashboard Coming Soon...</div>} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;