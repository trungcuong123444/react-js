import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Link } from "react-router-dom";
import '../css/history.css';

const History = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "products"));
                const historyData = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        name: data.name,
                        createdAt: data.createdAt?.toDate().toLocaleString(), // Thời gian đăng bài
                        approvedAt: data.approvedAt?.toDate().toLocaleString() || "Chưa duyệt", // Thời gian duyệt bài
                    };
                });
                setHistory(historyData);
            } catch (error) {
                console.error("Error fetching history: ", error);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div className="history-container">
            <div className="w3-sidebar w3-light-grey w3-bar-block" style={{ width: '13%' }}>
                <h3 className="w3-bar-item">Admin</h3>
                <Link to="/" className="w3-bar-item w3-button">Home</Link>
                <Link to="/checkproduct" className="w3-bar-item w3-button">Check Product</Link>
                <Link to="/history" className="w3-bar-item w3-button">History</Link>
                <Link to="/login" className="w3-bar-item w3-button">Đăng xuất</Link>
            </div>

            <div className="content">
                <h2>Lịch sử thời gian đăng bài</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Tên sản phẩm</th>
                            <th>Thời gian đăng</th>
                            <th>Thời gian duyệt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map(item => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.createdAt}</td>
                                <td>{item.approvedAt}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default History;
