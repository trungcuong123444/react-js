import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

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