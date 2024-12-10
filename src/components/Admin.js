// Admin.js

import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useNavigate, Link,products } from "react-router-dom";
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
            <div className="w3-sidebar">
                <h3>Admin</h3>
                <Link to="/" className="w3-bar-item">Home</Link>
                <Link to="/checkproduct" className="w3-bar-item">CheckProduct</Link>
                <Link to="/listproduct" className="w3-bar-item">ListProduct</Link>
                <Link to="/listcatalog" className="w3-bar-item">ListCatalog</Link>
                <Link to="/history" className="w3-bar-item">Lịch sử bài đăng</Link>
                <Link to="/login" className="w3-bar-item">Đăng xuất</Link>
            </div>
    
            {/* Admin Content */}
            <div className="admin-content">
                <h2>Admin </h2>
                <h2>quản lý người dùng </h2>
                
                {/* User List Section */}
                <div className="admin-section">
                    <ul>
                        {users.map((user) => (
                            <li key={user.id}>
                                
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Name:</strong> {user.name}</p>
                                <p><strong>Role:</strong> {user.role || "User"}</p>
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
                    <p><strong>Total users:</strong> {users.length}</p>
                    {/* Add more statistics if necessary */}
                </div>
            </div>
        </div>
    );
    
};

export default Admin;
