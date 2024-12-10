import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../css/userproduct.css";
import { Button, Card, Row, Col } from "react-bootstrap";

const UserProduct = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProducts = async () => {
            const user = auth.currentUser;
            if (user) {
                const q = query(collection(db, "products"), where("uid", "==", user.uid));
                const querySnapshot = await getDocs(q);
                const productsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt ? doc.data().createdAt.toDate().toLocaleString() : "N/A"
                }));
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
            <div className="sidebar">
                <h3>Doanh nghiệp</h3>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/addproduct">Add Product</Link></li>
                    <li><Link to="/addcatalog">Add Catalog</Link></li>
                    <li><Link to="/userproduct">User Products</Link></li>
                </ul>
            </div>
            
            <div className="content">
                <h2>Your Products</h2>
                <p>Tổng số bài đăng: {products.length}</p>
                <Row>
                    {products.map(product => (
                        <Col sm={12} md={6} lg={4} key={product.id}>
                            <Card className="product-card mb-4">
                                {product.imageUrl && <Card.Img variant="top" src={product.imageUrl} />}
                                <Card.Body>
                                    <Card.Title>{product.name}</Card.Title>
                                    <Card.Text>{product.description}</Card.Text>
                                    <Card.Text><strong>Category:</strong> {product.category}</Card.Text>
                                    <Card.Text><strong>Tags:</strong> {product.tags.join(", ")}</Card.Text>
                                    <Card.Text>
                                        <strong>Link:</strong> <a href={product.link} target="_blank" rel="noopener noreferrer">{product.link}</a>
                                    </Card.Text>
                                    <Card.Text><strong>Time:</strong> {product.createdAt}</Card.Text>
                                    <Button variant="primary" onClick={() => handleUpdate(product.id)}>Update</Button>
                                    <Button variant="danger" onClick={() => handleDelete(product.id)} className="ms-2">Delete</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
};

export default UserProduct;
