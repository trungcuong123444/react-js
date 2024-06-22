import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebaseConfig';
import '../css/ProductReview.css';

const ProductReview = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const docRef = doc(db, "products", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProduct(docSnap.data());
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                setError('Error fetching product: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="product-review-container">
            <h2>Đánh giá sản phẩm {product?.name}</h2>
            <p>{product?.description}</p>
            <div className="product-details">
                <p>Danh mục: {product?.category}</p>
                <p>Tags: {product?.tags.join(', ')}</p>
                {product?.imageUrl && <img src={product?.imageUrl} alt={product?.name} />}
                <p><a href={product?.link}>Liên kết sản phẩm</a></p>
               
                <Link to={`/productdetails/${id}`}>Quay lại chi tiết sản phẩm</Link>
            </div>
        </div>
    );
};

export default ProductReview;
