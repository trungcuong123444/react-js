import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>Menu</h2>
            <ul>
                <li><Link to="/addproduct">Add Product</Link></li>
                <li><Link to="/userproduct">Your Products</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;
