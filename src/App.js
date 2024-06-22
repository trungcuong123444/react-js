// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import AddProduct from './components/AddProduct'; // Đảm bảo đường dẫn chính xác tới Addproduct
import UserProduct from './components/UserProduct';
import ProductDetails from './components/ProductDetails';
import Admin from './components/Admin';
import CheckProduct from './components/CheckProduct';
import AItool from './components/AItools';
import AIagents from './components/AIagents';
import AItutorials from './components/AItutorials';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/addproduct" element={<AddProduct />} /> {/* Sửa lại đường dẫn */}
          <Route path="/userproduct" element={<UserProduct />} />
          <Route path="/productdetails/:id" element={<ProductDetails />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/checkproduct" element={<CheckProduct />} />
          <Route path="/aitools" element={<AItool />} />
          <Route path="/aiagents" element={<AIagents />} />
          <Route path="/aitutorials" element={<AItutorials />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
