import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "../css/listproduct.css";
import { Link } from "react-router-dom";

const ListProduct = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const querySnapshot = await getDocs(collection(db, "products"));
            const productsData = querySnapshot.docs.map(doc => doc.data());
            setProducts(productsData);
        };

        fetchProducts();
    }, []);

    return (
        <div className="listproduct-container">
            <div className="w3-sidebar w3-light-grey w3-bar-block" style={{ width: '13%' }}>
                <h3 className="w3-bar-item">Admin</h3>
                <Link to="/" className="w3-bar-item w3-button">Home</Link>
                <Link to="/checkproduct" className="w3-bar-item w3-button">CheckProduct</Link>
                <Link to="/listproduct" className="w3-bar-item w3-button">ListProduct</Link>
             
            </div>
            <h2>List of Products</h2>
            <div className="product-list">
                {products.map((product, index) => (
                    <div key={index} className="product">
                        <img src={product.image} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p><strong>Category:</strong> {product.category}</p>
                        <p><strong>Tags:</strong> {product.tags.join(", ")}</p>
                        <a href={product.link} target="_blank" rel="noopener noreferrer">View Product</a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListProduct;
