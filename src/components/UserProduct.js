import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../css/userproduct.css"
const UserProduct = () => {
    const [products, setProducts] = useState([]);
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

    return (
        <div className="auth-container">
            <div className="w3-sidebar w3-light-grey w3-bar-block" style={{ width: '13%' }}>
                <h3 className="w3-bar-item">Doanh nghiệp</h3>
                <Link to="/" className="w3-bar-item w3-button">Home</Link>
                <Link to="/addproduct" className="w3-bar-item w3-button">AddProduct</Link>
                <Link to="/addcatalog" className="w3-bar-item w3-button">AddCatalog</Link>
                <Link to="/userproduct" className="w3-bar-item w3-button">UserProduct</Link>

            </div>
            
            <ul>
            <h2>Your Products</h2>
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
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserProduct;
