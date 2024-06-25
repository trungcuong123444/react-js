import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from "./components/Home";
import Admin from "./components/Admin";
import Login from "./components/Login";
import Register from "./components/Register";
import AddProduct from "./components/AddProduct";
import CheckProduct from "./components/CheckProduct";
import ListProduct from "./components/ListProduct";
import UserProduct from "./components/UserProduct";
import UpdateProduct from "./components/UpdateProduct";
import AddCatalog from "./components/AddCatalog";
import AItool from './components/AItools';
import AIagents from './components/AIagents';
import AItutorials from './components/AItutorials';
import AIInnovations from './components/AIInnovations';
import ProductInformation from './components/ProductInformation';

function App() {
  return (
    <Router>
      <div className="App">
        <MainContent />
      </div>
    </Router>
  );
}

function MainContent() {
  const location = useLocation();

  useEffect(() => {
    const footer = document.getElementById('main-footer');
    if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/login') || location.pathname.startsWith('/register') || location.pathname.startsWith('/checkproduct') || location.pathname.startsWith('/listproduct') || location.pathname.startsWith('/updateproduct') || location.pathname.startsWith('/userproduct') || location.pathname.startsWith('/addproduct') || location.pathname.startsWith('/addcatalog')) {
      if (footer) footer.style.display = 'none';
    } else {
      if (footer) footer.style.display = 'block';
    }
  }, [location]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/addcatalog" element={<AddCatalog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/updateproduct/:productId" element={<UpdateProduct />} />
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/userproduct" element={<UserProduct />} />
        <Route path="/listproduct" element={<ListProduct />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/checkproduct" element={<CheckProduct />} />
        <Route path="/aitools" element={<AItool />} />
        <Route path="/aiagents" element={<AIagents />} />
        <Route path="/aitutorials" element={<AItutorials />} />
        <Route path="/aiinnovations" element={<AIInnovations />} />
        <Route path="/productinfor/:id" element={<ProductInformation />} />
      </Routes>
    </>
  );
}

export default App;
