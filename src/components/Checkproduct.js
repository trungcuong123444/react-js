import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Link } from "react-router-dom";

const CheckProduct = () => {
    const [products, setProducts] = useState([]);
    
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "products"));
                const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProducts(productsData);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    const handleApprove = async (productId) => {
        try {
            const productRef = doc(db, "products", productId);
            await updateDoc(productRef, { status: "approved" });
            setProducts(products.filter(product => product.id !== productId));
            console.log("Product approved successfully.");
        } catch (error) {
            console.error("Error approving product:", error);
        }
    };

    const handleReject = async (productId) => {
        try {
            const productRef = doc(db, "products", productId);
            await updateDoc(productRef, { status: "rejected" });
            setProducts(products.filter(product => product.id !== productId));
            console.log("Product rejected successfully.");
        } catch (error) {
            console.error("Error rejecting product:", error);
        }
    };

    return (
        <div className="auth-container">
            {/* Sidebar */}
            <div className="w3-sidebar w3-light-grey w3-bar-block" style={{ width: '25%' }}>
                <h3 className="w3-bar-item">Admin</h3>
                <Link to="/" className="w3-bar-item w3-button">Home</Link>
                <Link to="/checkproduct" className="w3-bar-item w3-button">CheckProduct</Link>
                <Link to="/listproduct" className="w3-bar-item w3-button">ListProduct</Link>
                <Link to="/updateproduct" className="w3-bar-item w3-button">UpdateProduct</Link>
                <a href="#" className="w3-bar-item w3-button">Phân Quyền</a>
            </div>

            {/* Main Content */}
            <div>
                <h2>Check Products</h2>
                <ul>
                    {products.filter(product => product.status === "pending").map(product => (
                        <li key={product.id}>
                            <p>Name: {product.name}</p>
                            <p>Description: {product.description}</p>
                            <p>Category: {product.category}</p>
                            {product.imageUrl && <img src={product.imageUrl} alt={product.name} style={{ maxWidth: '100px' }} />}
                            <p>Tags: {product.tags.join(", ")}</p>
                            <p>Link: <a href={product.link} target="_blank" rel="noopener noreferrer">{product.link}</a></p>
                            <button onClick={() => handleApprove(product.id)}>Approve</button>
                            <button onClick={() => handleReject(product.id)}>Reject</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CheckProduct;
