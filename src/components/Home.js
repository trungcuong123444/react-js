import React, { useState, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebaseConfig";
import { useNavigate, useLocation } from "react-router-dom";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import "../css/Home.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filterCategory, setFilterCategory] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [message, setMessage] = useState("");
    const [items, setItems] = useState([]);
    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        setFilteredProducts(products);
    }, [products]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchProducts = async () => {
        try {
            const productsCollection = collection(db, "products");
            const q = query(productsCollection);

            const querySnapshot = await getDocs(q);
            const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(productsData);
        } catch (error) {
            console.error("Error fetching products: ", error);
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

  return (
    <div>
      <header>
        <nav>
          <div className="container">
            <h1>FUTUREPEDIA</h1>
            <ul>
              {user && <p>Hello, {user.displayName || user.email}</p>}
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
              {!user && (
                <li>
                  <button onClick={handleNavigateToRegister}>Login</button>
                </li>
              )}
              {!user && (
                <li>
                  <button onClick={handleNavigateToRegister}>Register</button>
                </li>
              )}
              <li>
                <button onClick={handleNavigateToAddProduct}>Add Product</button>
              </li>
              <li>
                <button onClick={handleNavigateToListProduct}>
                  List Products
                </button>
              </li>
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
        
      <section className="templateContainer">
        <div className="searchInput_Container">
          <input
            id="searchInput"
            type="text"
            placeholder="Search AI Tools here..."
            onChange={(event) => setSearchTerm(event.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <div className="row justify-content-center">
          <div className="col-12">
            <button
              type="button"
              className="btn btn-danger me-3 mb-3"
              onClick={() => setItems(showAllProducts)}
            >
              All Product
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
              onClick={() => filterItems("Video")}
            >
              Video
            </button>
            <hr></hr>
          </div>
        </div>
                </section>

                <section className="user-products">
                    <div className="container">
                        {filteredProducts.length > 0 ? (
                            <div>
                                <h3>Sản phẩm của tôi</h3>
                                <ul>
                                    {filteredProducts.map(product => (
                                        <li key={product.id}>
                                            <h4>{product.name}</h4>
                                            <p>{product.description}</p>
                                            {product.imageUrl && <img src={product.imageUrl} alt={product.name} style={{ width: "100px" }} />}
                                            <p>Danh mục: {product.category}</p>
                                            <p>Tags: {product.tags.join(", ")}</p>
                                            <p><a href={product.link}>Liên kết sản phẩm</a></p>
                                            <div>
                                                <p>Đánh giá: </p>
                                                {[...Array(product.rating)].map((star, i) => (
                                                    <FontAwesomeIcon icon={faStar} key={i} />
                                                ))}
                                               
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p>Không có sản phẩm nào.</p>
                        )}
                    </div>
                </section>

            <footer>
                <div className="container">
                    <p>&copy; 2024 FUTUREPEDIA. All rights reserved.</p>
                </div>
            </footer>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Home;
