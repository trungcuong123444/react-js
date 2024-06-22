import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import "../css/aitutorials.css"; // Import CSS file

import img1 from '../img/anh1.webp';
import img2 from '../img/anh2.webp';
import img3 from '../img/anh3.webp';
import img4 from '../img/anh4.webp';
import img5 from '../img/anh5.webp';
import img6 from '../img/anh6.webp';
import img7 from '../img/anh7.webp';
import img8 from '../img/anh8.webp';

const AItutorials = () => {
    const [aitutorials, setAItutorials] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAItutorials = async () => {
            try {
                const q = query(collection(db, "aitutorials"), where("status", "==", "approved"));
                const querySnapshot = await getDocs(q);
                const toolsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAItutorials(toolsData);
            } catch (error) {
                console.error("Error fetching AI Tools:", error);
            }
        };

        fetchAItutorials();
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
                    <h1>Free AI Tutorials & Demos</h1>
                    <h2>We're here to help you work smarter through AI adoption and seeing what it can do is paramount. So we've curated a list of our favorite 12 AI tutorials and use cases for you to explore.</h2>
                    <form className="form-inline my-2 my-lg-0">
                        <div className="search-bar">
                            <input type="text" placeholder="Enter a tool name or use case..." />
                            <button>Search AI Tools</button>
                        </div>
                    </form>
                </div>
            </section>
            
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

            <section className="products">
                <div className="container">
                    {aitutorials.map(tool => (
                        <div key={tool.id} className="card mb-4 box-shadow" onClick={() => handleNavigateToDetails(tool.id)}>
                            <img className="card-img-top" src={tool.imageUrl} alt={tool.title}/>
                            <div className="card-body">
                                <p className="card-text">{tool.description}</p>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="btn-group">
                                        <button type="button" className="btn btn-sm btn-outline-secondary">View</button>
                                        <button type="button" className="btn btn-sm btn-outline-secondary">Edit</button>
                                    </div>
                                    <small className="text-muted">9 mins</small>
                                </div>
                            </div>
                        </div>
                    ))}
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

export default AItutorials;
