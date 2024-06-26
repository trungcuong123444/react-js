import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, query, orderBy, doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faFire, faClock, faFilter, faCheckCircle, faEye } from "@fortawesome/free-solid-svg-icons";
import "../css/Home.css";

const Home = () => {
    const [filterType, setFilterType] = useState("featured");
    const [showFilters, setShowFilters] = useState(false);
    const [features, setFeatures] = useState({
        waitlist: false,
        openSource: false,
        mobileApp: false,
        discordCommunity: false,
        api: false,
        noSignupRequired: false,
        browserExtension: false,
    });
    const [view, setView] = useState(true);
    const [clickCounts, setClickCounts] = useState({});
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                const productsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                const clickCountsData = {};
                await Promise.all(
                    productsData.map(async (product) => {
                        const productRef = doc(db, "products", product.id);
                        const productDoc = await getDoc(productRef);
                        if (productDoc.exists()) {
                            clickCountsData[product.id] = productDoc.data().clickCount || 0;
                        } else {
                            clickCountsData[product.id] = 0;
                        }
                    })
                );

                setProducts(productsData);
                setClickCounts(clickCountsData);
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
        setView((prevView) => !prevView);
    };

    const handleFilterChange = (filter) => {
        setFilterType(filter);
    };

    const filterProducts = (type, productsData) => {
        const now = Timestamp.now().toDate();
        const threeDaysAgo = new Date(now);
        threeDaysAgo.setDate(now.getDate() - 3);

        switch (type) {
            case "featured":
                setFilteredProducts(productsData.filter((product) => product.featured));
                break;
            case "popular":
                const sortedProducts = productsData.sort((a, b) => {
                    const clicksA = clickCounts[a.id] || 0;
                    const clicksB = clickCounts[b.id] || 0;
                    return clicksB - clicksA;
                });
                setFilteredProducts(sortedProducts);
                break;
            case "new":
                setFilteredProducts(
                    productsData.filter((product) => product.createdAt.toDate() > threeDaysAgo)
                );
                break;
            case "all":
                setFilteredProducts(productsData);
                break;
            default:
                setFilteredProducts(productsData);
                break;
        }
    };

    const handleFeatureChange = (feature) => {
        setFeatures((prevFeatures) => {
            const updatedFeatures = {
                ...prevFeatures,
                [feature]: !prevFeatures[feature],
            };
            filterProducts(updatedFeatures);
            return updatedFeatures;
        });
    };

    const handleSearch = () => {
        const searchTermLower = searchTerm.toLowerCase();
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(searchTermLower)
        );
        setFilteredProducts(filtered);
    };

    const showAllProducts = () => {
        setFilteredProducts(products);
    };

    const filterItems = (catItem) => {
        const filtered = products.filter((product) => product.category === catItem);
        setFilteredProducts(filtered);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSearch();
        }
    };

    const handleProductClick = async (productId) => {
        try {
            const productRef = doc(db, "products", productId);
            await updateDoc(productRef, {
                clickCount: (clickCounts[productId] || 0) + 1,
            });

            setClickCounts((prevCounts) => ({
                ...prevCounts,
                [productId]: (prevCounts[productId] || 0) + 1,
            }));

            navigate(`/productinfor/${productId}`);
        } catch (error) {
            console.error("Error updating click count:", error);
        }
    };

    useEffect(() => {
        if (selectedCategories.length === 0) {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(product =>
                selectedCategories.includes(product.category)
            );
            setFilteredProducts(filtered);
        }
    }, [selectedCategories, products]);

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
                        <input
                            type="text"
                            placeholder="Enter a tool name or use case..."
                            onChange={(event) => setSearchTerm(event.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button onClick={handleSearch}>Search AI Tools</button>
                    </div>
                </div>
            </section>

            <section className="tags">
                <div className="button-container">
                    <button
                        type="button"
                        className="btn btn-danger me-3 mb-3"
                        onClick={() => filterItems("Marketing")}
                    >
                        Marketing
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger me-3 mb-3"
                        onClick={() => filterItems("Productivity")}
                    >
                        Productivity
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger me-3 mb-3"
                        onClick={() => filterItems("Design")}
                    >
                        Design
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger me-3 mb-3"
                        onClick={() => filterItems("Video")}
                    >
                        Video
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger me-3 mb-3"
                        onClick={() => filterItems("AI Chatbots")}
                    >
                        AI Chatbots
                    </button>
                </div>
            </section>

            <div className="search-results">
                <div className="filter-buttons">
                    <button
                        className={`filter-button ${filterType === "featured" ? "active" : ""}`}
                        onClick={() => handleFilterChange("featured")}
                    >
                        <FontAwesomeIcon icon={faStar} /> Featured
                    </button>
                    <button
                        className={`filter-button ${filterType === "popular" ? "active" : ""}`}
                        onClick={() => handleFilterChange("popular")}
                    >
                        <FontAwesomeIcon icon={faFire} /> Popular
                    </button>
                    <button
                        className={`filter-button ${filterType === "new" ? "active" : ""}`}
                        onClick={() => handleFilterChange("new")}
                    >
                        <FontAwesomeIcon icon={faClock} /> New
                    </button>
                    <button
                        className={`filter-button ${filterType === "all" ? "active" : ""}`}
                        onClick={() => handleFilterChange("all")}
                    >
                        <FontAwesomeIcon icon={faFilter} /> All
                    </button>
                    <button className="btn btn-danger me-3 mb-3" onClick={showAllProducts}>
                        All Categories
                    </button>
                </div>

                <div className="search-results-content">
                    {filteredProducts.length === 0 ? (
                        <p>No products found</p>
                    ) : (
                        filteredProducts.map((product) => (
                            <div
                                className={`product-item ${view ? "list-view" : "grid-view"}`}
                                key={product.id}
                                onClick={() => handleProductClick(product.id)}
                            >
                                <img
                                    className="product-image"
                                    src={product.image}
                                    alt={product.name}
                                />
                                <h3 className="product-name">{product.name}</h3>
                                <p className="product-description">{product.description}</p>
                                <div className="product-details">
                                    {product.waitlist && (
                                        <span className="product-feature">
                                            <FontAwesomeIcon icon={faCheckCircle} /> Waitlist
                                        </span>
                                    )}
                                    {product.openSource && (
                                        <span className="product-feature">
                                            <FontAwesomeIcon icon={faCheckCircle} /> Open Source
                                        </span>
                                    )}
                                    {product.mobileApp && (
                                        <span className="product-feature">
                                            <FontAwesomeIcon icon={faCheckCircle} /> Mobile App
                                        </span>
                                    )}
                                    {product.discordCommunity && (
                                        <span className="product-feature">
                                            <FontAwesomeIcon icon={faCheckCircle} /> Discord Community
                                        </span>
                                    )}
                                    {product.api && (
                                        <span className="product-feature">
                                            <FontAwesomeIcon icon={faCheckCircle} /> API
                                        </span>
                                    )}
                                    {product.noSignupRequired && (
                                        <span className="product-feature">
                                            <FontAwesomeIcon icon={faCheckCircle} /> No Signup Required
                                        </span>
                                    )}
                                    {product.browserExtension && (
                                        <span className="product-feature">
                                            <FontAwesomeIcon icon={faCheckCircle} /> Browser Extension
                                        </span>
                                    )}
                                </div>
                                <div className="click-count">
                                    <FontAwesomeIcon icon={faEye} /> {clickCounts[product.id] || 0}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
