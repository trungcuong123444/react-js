import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

const AddCatalog = () => {
    const [catalogName, setCatalogName] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "catalogs"), {
                name: catalogName,
                createdAt: new Date()
            });
            setMessage("Catalog added successfully.");
            setCatalogName("");
        } catch (error) {
            setMessage("An error occurred. Please try again.");
        }
    };

    return (
        <div className="auth-container">
            <div className="w3-sidebar w3-light-grey w3-bar-block" style={{ width: '25%' }}>
                <h3 className="w3-bar-item">Admin</h3>
                <Link to="/" className="w3-bar-item w3-button">Home</Link>
                <Link to="/addproduct" className="w3-bar-item w3-button">AddProduct</Link>
                <Link to="/addcatalog" className="w3-bar-item w3-button">AddCatalog</Link>
                <Link to="/userproduct" className="w3-bar-item w3-button">UserProduct</Link>
            </div>
            <h2>Add Catalog</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Catalog Name"
                    value={catalogName}
                    onChange={(e) => setCatalogName(e.target.value)}
                    required
                />
                <button type="submit">Create</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AddCatalog;