// Admin.js

import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import "../css/admin.css"; // Import CSS for Admin styles

const Admin = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        
        const fetchUsers = async () => {
            try {
                const usersSnapshot = await getDocs(collection(db, "users"));
                const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setUsers(usersData);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const handleMakeAdmin = async (userId) => {
        const userRef = doc(db, "users", userId);
        try {
            await updateDoc(userRef, { role: "admin" });
            const updatedUsers = users.map((user) =>
                user.id === userId ? { ...user, role: "admin" } : user
            );
            setUsers(updatedUsers);
            console.log("User role updated successfully.");
        } catch (error) {
            console.error("Error updating user role:", error);
        }
    };


    return (
        <div className="admin-container">
            {/* Sidebar */}
            <div className="w3-sidebar w3-light-grey w3-bar-block" style={{ width: '13%' }}>
                <h3 className="w3-bar-item">Admin</h3>
                <Link to="/" className="w3-bar-item w3-button">Home</Link>
                <Link to="/checkproduct" className="w3-bar-item w3-button">CheckProduct</Link>
                <Link to="/listproduct" className="w3-bar-item w3-button">ListProduct</Link>
                <Link to="/listcatalog" className="w3-bar-item w3-button">ListCatalog</Link>
                <Link to="/login" className="w3-bar-item w3-button">Làm lại cuộc đời</Link>
             
                
                
            </div>
        
            {/* Admin Content */}
            <div className="admin-content">
                <h2>Admin Dashboard </h2>
                <h2>User List </h2>
                {/* User List Section */}
                <div className="admin-section">
                    <ul>
                        {users.map((user) => (
                            <li key={user.id}>
                                <p>ID: {user.id}</p>
                                <p>Email: {user.email}</p>
                                <p>Name: {user.name}</p>
                                <p>Role: {user.role}</p>
                                {!user.role && (
                                    <button onClick={() => handleMakeAdmin(user.id)}>Make Admin</button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Statistics Section */}
                <div className="admin-section">
                    <h3>Statistics</h3>
                    <p>Total users: {users.length}</p>
                    {/* Add more statistical information as needed */}
                </div>
            </div>
        </div>
    );
};

export default Admin;
