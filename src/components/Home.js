import React, { useState, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faFire, faClock, faFilter, faCheckCircle, faEye } from "@fortawesome/free-solid-svg-icons";
import "../css/Home.css";

const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [view, setView] = useState(true);
    const [filterType, setFilterType] = useState("featured"); // Default filter type

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
                filterProducts(filterType, productsData);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, [filterType]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const toggleView = () => {
        setView(prevView => !prevView);
    };

    const handleFilterChange = (filter) => {
        setFilterType(filter);
    };

    const filterProducts = (type, productsData) => {
        switch (type) {
            case "featured":
                setFilteredProducts(productsData.filter(product => product.featured));
                break;
            case "popular":
                setFilteredProducts(productsData.filter(product => product.popular));
                break;
            case "new":
                setFilteredProducts(productsData.filter(product => product.new));
                break;
            case "all":
                setFilteredProducts(productsData); // Assuming "all" should show all products
                break;
            default:
                setFilteredProducts(productsData);
                break;
        }
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
                            {user ? (
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
                            ) : (
                                <>
                                    <li><button onClick={() => navigate("/login")}>Login</button></li>
                                    <li><button onClick={() => navigate("/register")}>Register</button></li>
                                </>
                            )}
                            {user && <li>Hello, {user.displayName || user.email}</li>}
                            {user && <li><button onClick={handleLogout}>Logout</button></li>}
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
                    <button onClick={() => handleFilterChange("marketing")}>Marketing</button>
                    <button onClick={() => handleFilterChange("productivity")}>Productivity</button>
                    <button onClick={() => handleFilterChange("design")}>Design</button>
                    <button onClick={() => handleFilterChange("video")}>Video</button>
                    <button onClick={() => handleFilterChange("research")}>Research</button>
                    <button onClick={() => handleFilterChange("all")}>All Categories</button>
                </div>
            </section>

            <div className="container">
                <div className="breadcrumb-container">
                    <ul className="nav">
                        <li className="nav-item">
                            <a className={`nav-link ${filterType === "featured" ? "active" : ""}`} onClick={() => handleFilterChange("featured")}>
                                <FontAwesomeIcon icon={faStar} /> Featured
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link ${filterType === "popular" ? "active" : ""}`} onClick={() => handleFilterChange("popular")}>
                                <FontAwesomeIcon icon={faFire} /> Popular
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link ${filterType === "new" ? "active" : ""}`} onClick={() => handleFilterChange("new")}>
                                <FontAwesomeIcon icon={faClock} /> New
                            </a>
                        </li>
                    </ul>

                    <hr />
                    <button className="filters-button" onClick={() => handleFilterChange("Filters")}>
                        <FontAwesomeIcon icon={faFilter} /> Filters
                    </button>
                    <button className="verified-button" onClick={() => handleFilterChange("Verified")}>
                        <FontAwesomeIcon icon={faCheckCircle} /> Verified
                    </button>
                    <button className="switch-button" onClick={toggleView}>
                        <FontAwesomeIcon icon={faEye} /> {view ? " View" : " View1"}
                    </button>
                </div>
            </div>

            <section className="products">
                <div className="container">
                    <div className={`product-list ${view ? '' : 'vertical-view'}`}>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
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
                            <p>No products available</p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
