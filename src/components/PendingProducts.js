import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const PendingProducts = () => {
    const [pendingProducts, setPendingProducts] = useState([]);

    useEffect(() => {
        const fetchPendingProducts = async () => {
            const q = query(collection(db, "products"), where("status", "==", "pending"));
            const querySnapshot = await getDocs(q);
            const productsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt ? doc.data().createdAt.toDate().toLocaleString() : "N/A"
            }));
            setPendingProducts(productsData);
        };

        fetchPendingProducts();
    }, []);

    return (
        <div className="content">
            <h2>Sản phẩm chờ duyệt </h2>
            <p>Tổng số sản phẩm chờ duyệt của bạn: {pendingProducts.length}</p>
            <Row>
                {pendingProducts.map(product => (
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
                                <Button variant="primary" as={Link} to={`/productdetails/${product.id}`}>View Details</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default PendingProducts;
