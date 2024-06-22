import React, { useState, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { useNavigate, Link } from "react-router-dom";
import { collection, query, getDocs, where } from "firebase/firestore";
import "../css/Home.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filterType, setFilterType] = useState("featured");
    const [view, setView] = useState(true);

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
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [products, filterType]);

    const fetchProducts = async () => {
        try {
            const productsCollection = collection(db, "products");
            const querySnapshot = await getDocs(productsCollection);
            const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(productsData);
        } catch (error) {
            console.error("Error fetching products: ", error);
        }
    };

    const filterProducts = () => {
        switch (filterType) {
            case "featured":
                setFilteredProducts(products.filter(product => product.featured));
                break;
            case "popular":
                setFilteredProducts(products.filter(product => product.popular));
                break;
            case "new":
                setFilteredProducts(products.filter(product => product.new));
                break;
            default:
                setFilteredProducts(products);
                break;
        }
    };

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

    const handleFilterCategory = (type) => {
        setFilterType(type);
    };

    const handleSearch = (searchTerm) => {
        const searchTermLower = searchTerm.toLowerCase();
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(searchTermLower)
        );
        setFilteredProducts(filtered);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSearch(event.target.value);
        }
    };

    const handleNavigateToDetails = (productId) => {
        navigate(`/productdetails/${productId}`);
    };

    const toggleView = () => {
        setView(prevState => !prevState);
    };

    return (
        <div>
            <header>
                <nav>
                    <div className="container">
                        <h1>FUTUREPEDIA</h1>
                        <ul>
                            {user && <p>Hello, {user.displayName || user.email}</p>}
                            {user ? (
                                <>
                                    <li><button onClick={handleLogout}>Logout</button></li>
                                    <li><button onClick={handleNavigateToAddProduct}>Add Product</button></li>
                                    <li><button onClick={handleNavigateToListProduct}>List Products</button></li>
                                </>
                            ) : (
                                <>
                                    <li><button onClick={handleNavigateToRegister}>Login</button></li>
                                    <li><button onClick={handleNavigateToRegister}>Register</button></li>
                                </>
                            )}
                        </ul>
                    </div>
                </nav>
            </header>

            <main className="main-content">
                <section className="hero">
                    <div className="container">
                        <h2>FUTUREPEDIA</h2>
                        <p>Explore our latest products and exclusive deals.</p>
                        <button>Click Now</button>
                    </div>
                </section>

                <div className="col-12">
                <button
                    type="button"
                    className={`btn ${filterType === "featured" ? "btn-danger active" : "btn-outline-danger"}`}
                    onClick={() => handleFilterCategory("featured")}
                >
                    Featured
                </button>
                <button
                    type="button"
                    className={`btn ${filterType === "popular" ? "btn-danger active" : "btn-outline-danger"}`}
                    onClick={() => handleFilterCategory("popular")}
                >
                    Popular
                </button>
                <button
                    type="button"
                    className={`btn ${filterType === "new" ? "btn-danger active" : "btn-outline-danger"}`}
                    onClick={() => handleFilterCategory("new")}
                >
                    New
                </button>
 

                    {/* Toggle Button Placed Here */}
                    <button className="switch-button" onClick={toggleView}>
                        {view ? "Switch to My Products" : "Switch to Product List"}
                    </button>
                    <hr />
                </div>

                <h2>
                    {filterType === "featured" ? "Featured Products" :
                        filterType === "popular" ? "Popular Products" :
                            filterType === "new" ? "New Products" : ""}
                </h2>

                <div className="product-list">
                    {/* Product List or My Product List rendering based on `view` */}
                    {view ? (
    // Render danh sách sản phẩm
    filteredProducts.length > 0 ? (
        <div className="product-list">
            {filteredProducts.map(product => (
                <div className="product" key={product.id}>
                    <img src={product.imageUrl} alt={product.name} />
                    <div className="product-details-vertical">
                        <h3>{product.name}</h3>
                        <p>Description: {product.description}</p>
                        <p>Category: {product.category}</p>
                        <p>Tags: {product.tags.join(", ")}</p>
                        <p>
                            <a href={product.link} target="_blank" rel="noopener noreferrer">
                                Product Link
                            </a>
                        </p>
                        <div className="ratings">
                            <p>Rating: </p>
                            {[...Array(product.rating)].map((_, i) => (
                                <FontAwesomeIcon icon={faStar} key={i} />
                            ))}
                            <Link to={`/product/${product.id}/review`} className="review-button">
                                {product.numReviews} Reviews
                            </Link>
                        </div>
                        <button className="details-button" onClick={() => handleNavigateToDetails(product.id)}>
                            Details
                        </button>
                    </div>
                </div>
            ))}
        </div>
    ) : (
        <p>No products available</p>
    )
) : (
    // Render danh sách sản phẩm người dùng
    filteredProducts.length > 0 ? (
        <ul className="my-product-list">
            {filteredProducts.map(product => (
                <li key={product.id}>
                    <h4>{product.name}</h4>
                    <p>Description: {product.description}</p>
                    {product.imageUrl && (
                        <img src={product.imageUrl} alt={product.name} style={{ width: "100px" }} />
                    )}
                    <p>Category: {product.category}</p>
                    <p>Tags: {product.tags.join(", ")}</p>
                    <p>
                        <a href={product.link} target="_blank" rel="noopener noreferrer">
                            Product Link
                        </a>
                    </p>
                    <div className="ratings">
                        <p>Rating: </p>
                        {[...Array(product.rating)].map((_, i) => (
                            <FontAwesomeIcon icon={faStar} key={i} />
                        ))}
                        <Link to={`/product/${product.id}/review`} className="review-button">
                            {product.numReviews} Reviews
                        </Link>
                    </div>
                    <button className="details-button" onClick={() => handleNavigateToDetails(product.id)}>
                        Details
                    </button>
                </li>
            ))}
        </ul>
    ) : (
        <p>No products available</p>
    )
)}


                </div>
            </main>

                    
            <footer>
                <div className="container">
                    <p>&copy; 2024 FUTUREPEDIA. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
