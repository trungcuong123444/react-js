import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Admin from "./components/Admin";
import Login from "./components/Login";
import Register from "./components/Register";
import AddProduct from "./components/Addproduct";
import CheckProduct from "./components/Checkproduct";

import ListProduct from "./components/ListProduct";
import UserProduct from "./components/UserProduct";
import UpdateProduct from "./components/UpdateProduct";
import ProductDetails from "./components/ProductDetails"; // Nhập ProductDetails

import ProductReview from './components/ProductReview';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/checkproduct" element={<CheckProduct />} />
        <Route path="/userproduct" element={<UserProduct />} />
        <Route path="/updateproduct/:productId" element={<UpdateProduct />} />
        <Route path="/listproduct" element={<ListProduct />} />

        <Route path="/productdetails/:productId" element={<ProductDetails />} />
        
        <Route path="/" element={<Home />} />
        <Route path="/product/:id/review" element={<ProductReview />} />
      

           
      </Routes>
    </Router>
  );
}

export default App;
