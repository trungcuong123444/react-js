import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import '../css/aiinnovations.css'; // Import file CSS của bạn

const AIInnovations = () => {
    const [aiinnovations, setaiinnovations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchaiinnovations = async () => {
            try {
                const q = query(collection(db, "aiinnovations"), where("status", "==", "approved"));
                const querySnapshot = await getDocs(q);
                const toolsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setaiinnovations(toolsData);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu AI Tools:", error);
            }
        };

        fetchaiinnovations();
  }, []);

    const handleNavigateToDetails = (toolId) => {
        navigate(`/productdetails/${toolId}`);
    };

    return (
        <div className="page-container">
            <header>
                <div className="container">
                    <h1>Futurepedia</h1>
                    <nav>
                        <ul>
                            <li><button onClick={() => navigate("/aitools")}>AI Tools</button></li>
                            <li><button onClick={() => navigate("/aiagents")}>AI Agents</button></li>
                            <li><button onClick={() => navigate("/aitutorials")}>AI Tutorials</button></li>
                            <li><button onClick={() => navigate("/aiinnovations")}>AI Innovations</button></li>
                        </ul>
                    </nav>
                </div>
            </header>
            </div>
    );
};

export default AIInnovations;