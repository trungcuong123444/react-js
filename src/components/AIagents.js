import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import '../css/aiagents.css'; // Import file CSS của bạn
import heroImage from '../img/anh1.webp'; // Import hình ảnh của bạn

const AIagents = () => {
    const [aiagents, setAIagents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAIagents = async () => {
            try {
                const q = query(collection(db, "aiagents"), where("status", "==", "approved"));
                const querySnapshot = await getDocs(q);
                const toolsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAIagents(toolsData);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu AI Tools:", error);
            }
        };

        fetchAIagents();
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

            <main className="hero">
                <div className="container hero-content">
                    <div className="hero-text">
                        <h1>AI Agent Tools - Revolutionizing Automation & Productivity</h1>
                        <p>Embark on a transformative journey with automation tools that have evolved significantly through AI agent technology. These tools are not confined to traditional scripts or sequences but are equipped with the ability to set goals, strategize, and adapt with human-like ingenuity. Their advanced adaptability allows AI agents to excel in dynamic environments, making informed decisions based on fresh data, which catalyzes innovation and streamlines task execution. Explore how these intelligent agents revolutionize task management and execution.</p>
                    </div>
                    <div className="hero-image">
                        <img src={heroImage} alt="AI Agents" />
                    </div>
                </div>
            </main>
            <div>
                
            <div className="container">
                <div className="breadcrumb-container">
                <ul class="nav">
                    <li class="nav-item">
                        <a class="nav-link active" href="#">Active</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Link</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Link</a>
                    </li>
                    </ul>
                </div>
                {/* Các phần tử khác */}
            </div>
            </div>
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

export default AIagents;
