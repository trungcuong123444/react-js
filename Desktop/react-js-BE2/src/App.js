  // src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import ProductInformation from './components/ProductInformation';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/addcatalog" element={<AddCatalog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/updateproduct/:productId" element={<UpdateProduct />} />
          <Route path="/addproduct" element={<AddProduct />} /> {/* Sửa lại đường dẫn */}
          <Route path="/userproduct" element={<UserProduct />} />
          <Route path="/listproduct" element={<ListProduct />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/checkproduct" element={<CheckProduct />} />
          <Route path="/aitools" element={<AItool />} />
          <Route path="/aiagents" element={<AIagents />} />
          <Route path="/aitutorials" element={<AItutorials />} />
          <Route path="/productinfor/:id" element={<ProductInformation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
