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
    const [dropdownOpen, setDropdownOpen] = useState(false);

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
        setUser(null);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className="home">
            <header>
                <nav>
                    <div className="container">
                        <h1>Futurepedia</h1>
                        <ul>
                            <li><button onClick={() => navigate("/aitools")}>AI Tools</button></li>
                            <li><button onClick={() => navigate("/aiagents")}>AI Agents</button></li>
                            <li><button onClick={() => navigate("/aitutorials")}>AI Tutorials</button></li>
                            <li><button onClick={() => navigate("/aiinnovations")}>AI Innovations</button></li>
                            {user && (
                                <li>
                                    <button onClick={toggleDropdown}>More</button>
                                    {dropdownOpen && (
                                        <ul className="dropdown-menu">
                                            <li><button onClick={() => navigate("/addproduct")}>Add Product</button></li>
                                            <li><button onClick={() => navigate("/addcatalog")}>Add Catalog</button></li>
                                            <li><button onClick={() => navigate("/userproduct")}>List Products</button></li>
                                            <li><button onClick={() => navigate("/sponsorship-options")}>Sponsorship Options</button></li>
                                            <li><button onClick={() => navigate("/submit-tool")}>Submit A Tool</button></li>
                                            <li><button onClick={() => navigate("/youtube-channel")}>YouTube Channel</button></li>
                                        </ul>
                                    )}
                                </li>
                            )}
                            {user && <li>Hello, {user.displayName || user.email}</li>}
                            {user && <li><button onClick={handleLogout}>Logout</button></li>}
                            {!user && <li><button onClick={() => navigate("/login")}>Login</button></li>}
                            {!user && <li><button onClick={() => navigate("/register")}>Register</button></li>}
                        </ul>
                    </div>
                </nav>
            </header>

            <section className="hero">
                <div className="container">
                    <h1>Discover what AI can do for you</h1>
                    <p>We've helped professionals learn to leverage AI by helping them find the best AI tools.</p>
                    <div className="search-bar">
                        <input type="text" placeholder="Enter a tool name or use case..." />
                        <button>Search AI Tools</button>
                    </div>
                </div>
            </section>

            <section className="tags">
                <div className="button-container">
                    <button>Marketing</button>
                    <button>Productivity</button>
                    <button>Design</button>
                    <button>Video</button>
                    <button>Research</button>
                    <button>All Categories</button>
                </div>
            </section>
            <div className="container">
                <div className="breadcrumb-container">
                <ul class="nav">
                    <li class="nav-item">
                        <a class="nav-link active" href="#">Featured</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Popular</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">New</a>
                    </li>
                    </ul>
                </div>
                {/* Các phần tử khác */}
            </div>
            <section className="products">
                <div className="container">
                    <h2>Featured Products</h2>
                    <div className="product-list">
                        {products.length > 0 ? (
                            products.map(product => (
                                <div className="product" key={product.id}>
                                    <div className="product-header">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="product-img"
                                            onClick={() => navigate(`/productinfor/${product.id}`)}
                                        />
                                        <p className="product-name">{product.name}</p>
                                    </div>
                                    <p className="product-description">{product.description}</p>
                                    <button onClick={() => window.open(product.link, "_blank")}>Visit</button>
                                </div>
                            ))
                        ) : (
                            <p>No approved products available</p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
