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
import AddCatalog from "./components/AddCatalog";
import MainLayout from "./components/MainLayout";

const App = () => {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<MainLayout />}>
                  <Route path="add-product" element={<AddProduct />} />
                  <Route path="add-catalog" element={<AddCatalog />} />
                  <Route path="user-products" element={<UserProduct />} />
              </Route>
          </Routes>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkproduct" element={<CheckProduct />} />     
        <Route path="/updateproduct/:productId" element={<UpdateProduct />} />
        <Route path="/listproduct" element={<ListProduct />} />
      </Routes>
      </Router>
  );
};



export default App;

