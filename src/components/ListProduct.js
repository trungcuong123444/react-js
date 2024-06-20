import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "../css/listproduct.css";

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
