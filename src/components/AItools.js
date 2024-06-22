import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import '../css/AItools.css'; // Cập nhật đường dẫn đúng

const AITools = () => {
    const [aiTools, setAiTools] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAITools = async () => {
            try {
                const q = query(collection(db, "aiTools"), where("status", "==", "approved"));
                const querySnapshot = await getDocs(q);
                const toolsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAiTools(toolsData);
            } catch (error) {
                console.error("Error fetching AI Tools:", error);
            }
        };

        fetchAITools();
    }, []);

    const handleNavigateToDetails = (toolId) => {
        navigate(`/productdetails/${toolId}`);
    };

    return (
        <div className="page-container">
            <header>
                <nav>
                    <div className="container">
                    <h1>Futurepedia</h1>
                        <ul>
                            <li><button onClick={() => navigate("/aitools")}>AI Tools</button></li>
                            <li><button onClick={() => navigate("/aiagents")}>AI Agents</button></li>
                            <li><button onClick={() => navigate("/aiagents")}>AI Tutorials</button></li>
                            <li><button onClick={() => navigate("/aiagents")}>AI Innovations</button></li>
                        </ul>
                    </div>
                </nav>
            </header>

            <section className="hero">
                <div className="container">
                    <h1>All AI Tool Categories</h1>
                    <h2>Find Most Popular and Featured Tools by Category.</h2>
                </div>
            </section>

            <section className="products main-content">
                <div className="category-card">
                    <img src="/src/img/anh1.webp" alt="AI Productivity Tools Image" className="category-image"/>
                    <div className="category-content">
                        <h2>AI Productivity Tools 1</h2>
                        <ul>
                            <li>Personal Assistant (0)</li>
                            <li>Research (0)</li>
                            <li>Spreadsheets (0)</li>
                            <li>Translator (0)</li>
                            <li>Presentations (0)</li>
                        </ul>
                        <a href="#">Show all AI Productivity Tools</a>
                    </div>
                </div>
                <div className="category-card">
                    <img src="/mnt/data/image2.png" alt="AI Productivity Tools Image" className="category-image"/>
                    <div className="category-content">
                        <h2>AI Productivity Tools 2</h2>
                        <ul>
                            <li>Personal Assistant (0)</li>
                            <li>Research (0)</li>
                            <li>Spreadsheets (0)</li>
                            <li>Translator (0)</li>
                            <li>Presentations (0)</li>
                        </ul>
                        <a href="#">Show all AI Productivity Tools</a>
                    </div>
                </div>
                <div className="category-card">
                    <img src="/mnt/data/image2.png" alt="AI Productivity Tools Image" className="category-image"/>
                    <div className="category-content">
                        <h2>AI Productivity Tools 2</h2>
                        <ul>
                            <li>Personal Assistant (0)</li>
                            <li>Research (0)</li>
                            <li>Spreadsheets (0)</li>
                            <li>Translator (0)</li>
                            <li>Presentations (0)</li>
                        </ul>
                        <a href="#">Show all AI Productivity Tools</a>
                    </div>
                </div>
                <div className="category-card">
                    <img src="/mnt/data/image2.png" alt="AI Productivity Tools Image" className="category-image"/>
                    <div className="category-content">
                        <h2>AI Productivity Tools 2</h2>
                        <ul>
                            <li>Personal Assistant (0)</li>
                            <li>Research (0)</li>
                            <li>Spreadsheets (0)</li>
                            <li>Translator (0)</li>
                            <li>Presentations (0)</li>
                        </ul>
                        <a href="#">Show all AI Productivity Tools</a>
                    </div>
                </div>
                <div className="category-card">
                    <img src="/mnt/data/image2.png" alt="AI Productivity Tools Image" className="category-image"/>
                    <div className="category-content">
                        <h2>AI Productivity Tools 2</h2>
                        <ul>
                            <li>Personal Assistant (0)</li>
                            <li>Research (0)</li>
                            <li>Spreadsheets (0)</li>
                            <li>Translator (0)</li>
                            <li>Presentations (0)</li>
                        </ul>
                        <a href="#">Show all AI Productivity Tools</a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AITools;
