import React, { useState, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, query, where, updateDoc,doc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/Home.css";

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filterCategory, setFilterCategory] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [items, setItems] = useState([]);
    const [catalogs, setCatalogs] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
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

    useEffect(() => {
        fetchProducts();
        fetchCatalogs();
        
            
    }, []);

    useEffect(() => {
        setFilteredProducts(products);
    }, [products]); 

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

    
    

    

    const fetchProducts = async () => {
        try {
            const productsCollection = collection(db, "products");
            const q = query(productsCollection);

            const querySnapshot = await getDocs(q);
            const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(productsData);
            setFilteredProducts(productsData);
        } catch (error) {
            console.error("Error fetching products: ", error);
        }
    };


    

    const fetchCatalogs = async () => {
        try {
            const catalogsCollection = collection(db, "catalogs");
            const q = query(catalogsCollection);

            const querySnapshot = await getDocs(q);
            const catalogsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCatalogs(catalogsData);
        } catch (error) {
            console.error("Error fetching catalogs: ", error);
        }
    };

    
    
    const handleFeatureChange = (feature) => {
        setFeatures(prevFeatures => {
            const updatedFeatures = {
                ...prevFeatures,
                [feature]: !prevFeatures[feature],
            };
            filterProducts(updatedFeatures);
            return updatedFeatures;
        });
    };

    const filterProducts = (updatedFeatures) => {
        const filtered = products.filter(product => {
            if (!product.features) return false; // Skip products without features field
            for (let key in updatedFeatures) {
                if (updatedFeatures[key] && !product.features[key]) {
                    return false;
                }
            }
            return true;
        });
        setFilteredProducts(filtered);
    };
    


    const handleLogout = async () => {
        await signOut(auth);
        setUser(null);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleFilterCategory = (category) => {
        setFilterCategory(category);
        if (category === "") {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(product => product.category === category);
            setFilteredProducts(filtered);
        }
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

   

    useEffect(() => {
        console.log('Selected Categories:', selectedCategories);
        if (selectedCategories.length === 0) {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(product =>
                selectedCategories.includes(product.category)
            );
            setFilteredProducts(filtered);
        }
        console.log('Filtered Products:', filteredProducts);
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
                        <input type="text" placeholder="Enter a tool name or use case..."
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
                    onClick={() => filterItems("Research"   )}
                >
                    Research
            </button>
                <button
                    type="button"
                    className="btn btn-danger me-3 mb-3"
                    onClick={() => setItems(showAllProducts)}
                >
                    All Categories
                </button>
                </div>
            </section>

            <section className="filters">
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
                    <button onClick={() => setShowFilters(!showFilters)}>Filter</button> {/* Toggle button to show/hide checkboxes */}
                        {showFilters && (
                            <div className="features">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={features.waitlist}
                                        onChange={() => handleFeatureChange('waitlist')}
                                    /> Waitlist
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={features.openSource}
                                        onChange={() => handleFeatureChange('openSource')}
                                    /> Open Source
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={features.mobileApp}
                                        onChange={() => handleFeatureChange('mobileApp')}
                                    /> Mobile App
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={features.discordCommunity}
                                        onChange={() => handleFeatureChange('discordCommunity')}
                                    /> Discord Community
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={features.api}
                                        onChange={() => handleFeatureChange('api')}
                                    /> API
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={features.noSignupRequired}
                                        onChange={() => handleFeatureChange('noSignupRequired')}
                                    /> No Signup Required
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={features.browserExtension}
                                        onChange={() => handleFeatureChange('browserExtension')}
                                    /> Browser Extension
                                </label>
                            </div>
                        )}
                    </ul>
                </div>       
         </div>
</section>
            <section className="user-products">
                <div className="container">
                    <h2>Featured Products</h2>
                    <div className="product-list">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <div className="product" key={product.id}>
                                    <div className="product-header">
                                    <h4>{product.name}</h4>
                                    
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            style={{ width: "100px" }}
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