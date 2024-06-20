import React, { useState, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebaseConfig";
import { useNavigate, useLocation } from "react-router-dom";
import { collection, query, getDocs, doc, updateDoc } from "firebase/firestore";
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
    const [message, setMessage] = useState("");
    const [rating, setRating] = useState(0); // State to store rating

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

    const clearFilters = () => {
        setFilterCategory("");
        setFilteredProducts(products);
    };

    const handleRateProduct = async (productId) => {
        try {
            if (rating === 0) {
                setMessage("Vui lòng chọn số sao trước khi đánh giá.");
                return;
            }

            // Update Firestore with rating
            const productRef = doc(db, "products", productId);
            await updateDoc(productRef, { rating });

            setMessage(`Bạn đã đánh giá sản phẩm ${productId} thành công với ${rating} sao.`);
        } catch (error) {
            console.error("Error rating product:", error);
            setMessage(`Đã xảy ra lỗi khi đánh giá sản phẩm.`);
        }
    };

    return (
        <div>
            <header>
                <nav>
                    <div className="container">
                        <h1>FUTUREPEDIA</h1>
                        <ul>
                            {user && <li><p>Hello, {user.displayName || user.email}</p></li>}
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
            </main>

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
