import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import "../css/UserProduct.css"; // Import the CSS file

const UserProduct = () => {
    const [products, setProducts] = useState([]);
    const [displayFormVisible, setDisplayFormVisible] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [displayCategories, setDisplayCategories] = useState({
        featured: false,
        popular: false,
        new: false
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProducts = async () => {
            const user = auth.currentUser;
            if (user) {
                const q = query(collection(db, "products"), where("uid", "==", user.uid));
                const querySnapshot = await getDocs(q);
                const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProducts(productsData);
            }
        };

        fetchUserProducts();
    }, []);

    const handleDelete = async (productId) => {
        await deleteDoc(doc(db, "products", productId));
        setProducts(products.filter(product => product.id !== productId));
    };

    const handleUpdate = (productId) => {
        navigate(`/updateproduct/${productId}`);
    };

    const handleDisplayOnHome = async (productId, displayCategories) => {
        const productRef = doc(db, "products", productId);
        await updateDoc(productRef, displayCategories);
        setProducts(products.map(product => 
            product.id === productId ? { ...product, ...displayCategories } : product
        ));
        setDisplayFormVisible(false);
    };

    const openDisplayForm = (product) => {
        setCurrentProduct(product);
        setDisplayFormVisible(true);
        setDisplayCategories({
            featured: product.featured || false,
            popular: product.popular || false,
            new: product.new || false
        });
    };

    const handleDisplayCategoryChange = (category) => {
        setDisplayCategories(prevState => ({
            ...prevState,
            [category]: !prevState[category]
        }));
    };

    return (
        <div className="auth-container">
            <h2>Your Products</h2>
            <ul>
                {products.map(product => (
                    <li key={product.id}>
                        <p>Name: {product.name}</p>
                        <p>Description: {product.description}</p>
                        <p>Category: {product.category}</p>
                        {product.imageUrl && <img src={product.imageUrl} alt={product.name} />}
                        <p>Tags: {product.tags.join(", ")}</p>
                        <p>Link: <a href={product.link} target="_blank" rel="noopener noreferrer">{product.link}</a></p>
                        <button onClick={() => handleUpdate(product.id)}>Update</button>
                        <button onClick={() => handleDelete(product.id)}>Delete</button>
                        <button onClick={() => openDisplayForm(product)}>Display</button>
                        {(product.featured || product.popular || product.new) && (
                            <button onClick={() => handleDisplayOnHome(product.id, { featured: false, popular: false, new: false })}>
                                Remove from Home
                            </button>
                        )}
                    </li>
                ))}
            </ul>
            {displayFormVisible && currentProduct && (
                <div className="display-form">
                    <h3>Choose Display Categories for {currentProduct.name}</h3>
                    <label>
                        <input
                            type="checkbox"
                            checked={displayCategories.featured}
                            onChange={() => handleDisplayCategoryChange("featured")}
                        />
                        Featured
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={displayCategories.popular}
                            onChange={() => handleDisplayCategoryChange("popular")}
                        />
                        Popular
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={displayCategories.new}
                            onChange={() => handleDisplayCategoryChange("new")}
                        />
                        New
                    </label>

               
                    <button onClick={() => handleDisplayOnHome(currentProduct.id, displayCategories)}>Save</button>
                    <button onClick={() => setDisplayFormVisible(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default UserProduct;
