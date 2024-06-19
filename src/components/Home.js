import React, { useState, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";

const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                if (currentUser.email === "admin@gmail.com") {
                    navigate("/admin");
                } else {
                    setUser(currentUser);
                }
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const q = query(collection(db, "products"), where("status", "==", "approved"));
                const querySnapshot = await getDocs(q);
                const productsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setProducts(productsData);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/login");
    };

    const handleNavigateToRegister = () => {
        navigate("/register");
    };

    const handleNavigateToAddProduct = () => {
        navigate("/addproduct");
    };

    const handleNavigateToListProduct = () => {
        navigate("/userproduct");
    };

    const handleNavigateToDetails = (productId) => {
        navigate(`/productdetails/${productId}`);
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
                        {products.length > 0 ? (
                            products.map(product => (
                                <div className="product" key={product.id}>
                                    <img src={product.imageUrl} alt={product.name} />
                                    <h3>{product.name}</h3>
                                    <p>{product.description}</p>
                                    <button onClick={() => handleNavigateToDetails(product.id)}>Details</button>
                                </div>
                            ))
                        ) : (
                            <p>No approved products available</p>
                        )}
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
