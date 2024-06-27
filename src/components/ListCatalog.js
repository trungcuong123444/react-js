import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, query, where, writeBatch } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import "../css/listcatalog.css";
import { Link } from 'react-router-dom';

const ListCatalog = () => {
    const [catalogs, setCatalogs] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchCatalogs = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "catalogs"));
                const catalogList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setCatalogs(catalogList);
            } catch (error) {
                setMessage("An error occurred while fetching catalogs.");
            }
        };

        fetchCatalogs();
    }, []);

    const handleDelete = async (id) => {
        try {
            const productsQuery = query(collection(db, "products"), where("catalogId", "==", id));
            const productsSnapshot = await getDocs(productsQuery);

            const batch = writeBatch(db);
            productsSnapshot.forEach(productDoc => {
                batch.delete(doc(db, "products", productDoc.id));
            });

            await batch.commit();

            await deleteDoc(doc(db, "catalogs", id));

            setCatalogs(catalogs.filter(catalog => catalog.id !== id));
            setMessage("Catalog and its products deleted successfully.");
        } catch (error) {
            setMessage("An error occurred while deleting the catalog and its products.");
        }
    };

    return (
        <div className="catalog-list-container">
            <div className="w3-sidebar w3-light-grey w3-bar-block" style={{ width: '13%' }}>
                <h3 className="w3-bar-item">Admin</h3>
                <Link to="/" className="w3-bar-item w3-button">Home</Link>
                <Link to="/checkproduct" className="w3-bar-item w3-button">CheckProduct</Link>
                <Link to="/listproduct" className="w3-bar-item w3-button">ListProduct</Link>
                <Link to="/listcatalog" className="w3-bar-item w3-button">ListCatalog</Link>
                <Link to="/login" className="w3-bar-item w3-button">Làm lại cuộc đời</Link>
            </div>  
            <h2>Catalog List</h2>
            {message && <p>{message}</p>}
            <table className="catalog-table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Thể loại</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {catalogs.map((catalog, index) => (
                        <tr key={catalog.id}>
                            <td>{index + 1}</td>
                            <td>{catalog.name}</td>
                            <td>
                                <button onClick={() => handleDelete(catalog.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListCatalog;
