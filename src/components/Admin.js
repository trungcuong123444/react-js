import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import "../css/admin.css";

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("");
    const navigate = useNavigate(); // Initialize the navigate function

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
            // Update local state after successful update
            const updatedUsers = users.map((user) =>
                user.id === userId ? { ...user, role: "admin" } : user
            );
            setUsers(updatedUsers);
            console.log("User role updated successfully.");
        } catch (error) {
            console.error("Error updating user role:", error);
        }
    };

    const handleCheckProduct = () => {
        navigate("/checkproduct"); // Navigate to the Checkproduct page
    };

    const handleNavigateToListProduct = () => {
        navigate("/listproduct");
    };

    const handleNavigateToAddProduct = () => {
        navigate("/addproduct");
    };

    const filteredUsers = users
        .filter((user) =>
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((user) => (filterRole ? user.role === filterRole : true));

    return (
        <div className="admin-container">
            <h2>Admin Dashboard</h2>
            <div className="admin-actions">
                <input
                    type="text"
                    placeholder="Search by email or name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select onChange={(e) => setFilterRole(e.target.value)} value={filterRole}>
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
            </div>
            <div className="admin-section">
                <h3>User List</h3>
                <ul>
                    {filteredUsers.map((user) => (
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
            <div className="admin-section">
                <h3>Statistics</h3>
                <p>Total users: {users.length}</p>
                {/* Add more statistical information as needed */}
            </div>
            <button onClick={handleCheckProduct}>Go to Check Product</button>
            <button onClick={handleNavigateToListProduct}>List Product</button>
            <button onClick={handleNavigateToAddProduct}>Add Product</button> {/* New button */}
        </div>
    );
};

export default Admin;
