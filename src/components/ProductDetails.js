import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "../css/ProductDetails.css";

const ProductDetails = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const docRef = doc(db, "products", productId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProduct(docSnap.data());
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };

        fetchProduct();
    }, [productId]);

    if (!product) {
        return <div>Loading...</div>;
    }

    const handleNavigateToExternalLink = (link) => {
        window.open(link, "_blank"); // Mở link trong tab mới
    };

    return (
        <div className="product-details">
            <h2>{product.name}</h2>
            <img src={product.imageUrl} alt={product.name} />
            <p>{product.description}</p>
            <p>Category: {product.category}</p>
            <p>Tags: {product.tags.join(", ")}</p>
            <button onClick={() => handleNavigateToExternalLink(product.link)}>Product Link</button>
        </div>
    );
};

export default ProductDetails;
