// src/components/CheckProduct.js
import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const CheckProduct = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            const querySnapshot = await getDocs(collection(db, "products"));
            const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(productsData);
        };

        fetchProducts();
    }, []);

    const handleApprove = async (productId) => {
        const productRef = doc(db, "products", productId);
        await updateDoc(productRef, { status: "approved" });
        setProducts(products.filter(product => product.id !== productId));
    };

    const handleReject = async (productId) => {
        const productRef = doc(db, "products", productId);
        await updateDoc(productRef, { status: "rejected" });
        setProducts(products.filter(product => product.id !== productId));
    };

    return (
        <div className="auth-container">
            <h2>Check Products</h2>
            <ul>
                {products.filter(product => product.status === "pending").map(product => (
                    <li key={product.id}>
                        <p>Name: {product.name}</p>
                        <p>Description: {product.description}</p>
                        <p>Category: {product.category}</p>
                        {product.imageUrl && <img src={product.imageUrl} alt={product.name} />}
                        <p>Tags: {product.tags.join(", ")}</p>
                        <p>Link: <a href={product.link} target="_blank" rel="noopener noreferrer">{product.link}</a></p>
                        <button onClick={() => handleApprove(product.id)}>Approve</button>
                        <button onClick={() => handleReject(product.id)}>Reject</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CheckProduct;
