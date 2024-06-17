import React, { useState, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";

const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null); // State để lưu thông tin người dùng

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                // Nếu có người dùng đăng nhập, lưu thông tin vào state
                setUser(currentUser);
            } else {
                // Nếu không có người dùng đăng nhập, reset state
                setUser(null);
            }
        });

        return () => unsubscribe(); // Cleanup function
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/login");
    };

    const handleNavigateToRegister = () => {
        navigate("/register");
    };

    // Navigation handlers for AddProduct and ListProduct
    const handleNavigateToAddProduct = () => {
        navigate("/addproduct");
    };

    const handleNavigateToListProduct = () => {
        navigate("/userproduct");
    };

    return (
        <div>
            <header>
                <nav>
                    <div className="container">
                        <h1>FUTUREPEDIA</h1>
                        <ul>
                            {user && <p>Hello, {user.displayName || user.email}</p>}
                            <li><button onClick={handleLogout}>Logout</button></li>
                            {!user && <li><button onClick={handleNavigateToRegister}>Login</button></li>}
                            {!user && <li><button onClick={handleNavigateToRegister}>Register</button></li>}
                            <li><button onClick={handleNavigateToAddProduct}>Add Product</button></li>
                            <li><button onClick={handleNavigateToListProduct}>List Products</button></li>
                        </ul>
                    </div>
                </nav>
            </header>

            <section className="hero">
                <div className="container">
                    <h2>FUTUREPEDIA</h2>
                    <p>Explore our latest products and exclusive deals.</p>
                    <button>Click Now</button>
                </div>
            </section>

            <section className="products">
                <div className="container">
                    <h2>Featured Products</h2>
                    <div className="product-list">
                        <div className="product">
                            <img src="https://via.placeholder.com/150" alt="Product" />
                            <h3>Product Name</h3>
                            <p>$99.99</p>
                            <button>Add to Cart</button>
                        </div>
                        <div className="product">
                            <img src="https://via.placeholder.com/150" alt="Product" />
                            <h3>Product Name</h3>
                            <p>$79.99</p>
                            <button>Add to Cart</button>
                        </div>
                        {/* Add more products as needed */}
                    </div>
                </div>
            </section>

            <footer>
                <div className="container">
                    <p>&copy; 2024 FUTUREPEDIA. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
