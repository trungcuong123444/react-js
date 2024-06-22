import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import '../css/AItools.css'; // Cập nhật đường dẫn đúng

import img1 from '../img/anh1.webp';
import img2 from '../img/anh2.webp';
import img3 from '../img/anh3.webp';
import img4 from '../img/anh4.webp';
import img5 from '../img/anh5.webp';
import img6 from '../img/anh6.webp';
import img7 from '../img/anh7.webp';
import img8 from '../img/anh8.webp';

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
                    <img src={img1} alt="AI Productivity Tools Image" className="category-image"/>
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
                    <img src={img2} alt="AI Productivity Tools Image" className="category-image"/>
                    <div className="category-content">
                        <h2>AI Video Tools</h2>
                        <ul>
                            <li>Video Enhancer (0)</li>
                            <li>Video Editing (0)</li>
                            <li>Video Generators (0)</li>
                            <li>Text To Video (0)</li>
                            <li>Video Editing (0)</li>  
                        </ul>
                        <a href="#">Show all AI Productivity Tools</a>
                    </div>
                </div>
                <div className="category-card">
                    <img src={img3} alt="AI Productivity Tools Image" className="category-image"/>
                    <div className="category-content">
                        <h2> AI Text Generators</h2>
                        <ul>
                            <li>Prompt Generators (0)</li>
                            <li>Writing Generators (0)</li>
                            <li>Paraphrasing (0)</li>
                            <li>Storyteller (0)</li>
                            <li>Copywriting (0)</li>
                        </ul>
                        <a href="#">Show all AI Productivity Tools</a>
                    </div>
                </div>
                <div className="category-card">
                    <img src={img4} alt="AI Productivity Tools Image" className="category-image"/>
                    <div className="category-content">
                        <h2> AI Text Generators</h2>
                        <ul>
                            <li> Website Builders (0)</li>
                            <li>Marketing (0)</li>
                            <li>Finance (0)</li>
                            <li>Project Management (0)</li>
                            <li>Social Media (0)</li>
                        </ul>
                        <a href="#">Show all AI Productivity Tools</a>
                    </div>
                </div>
                <div className="category-card">
                    <img src={img5} alt="AI Productivity Tools Image" className="category-image"/>
                    <div className="category-content">
                        <h2>AI Business Tools</h2>
                        <ul>
                            <li>AI Image Tools (0)</li>
                            <li>Image Generators(0)</li>
                            <li>Spreadsheets (0)</li>
                            <li>Image Editing (0)</li>
                            <li>Text To Image (0)</li>
                        </ul>
                        <a href="#">Show all AI Productivity Tools</a>
                    </div>
                </div>
                <div className="category-card">
                    <img src={img6} alt="AI Productivity Tools Image" className="category-image"/>
                    <div className="category-content">
                        <h2> AI Art Generators</h2>
                        <ul>
                            <li>Cartoon Generators (0)</li>
                            <li>Portrait Generators (0)</li>
                            <li>Image To Image (0)</li>
                            <li>Drawing(0)</li>
                            <li>Avatars (0)</li>
                        </ul>
                        <a href="#">Show all AI Productivity Tools</a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AITools;
