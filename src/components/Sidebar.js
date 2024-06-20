import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <nav>
        <ul>
          <li>
            <NavLink to="/add-product" activeClassName="active">Add Product</NavLink>
          </li>
          <li>
            <NavLink to="/add-catalog" activeClassName="active">Add Catalog</NavLink>
          </li>
          <li>
            <NavLink to="/user-products" activeClassName="active">Your Products</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
