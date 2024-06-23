import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import "../css/aitutorials.css"; // Import CSS file

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
                        <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
                        <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                    </form>
                </div>
            </section>

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

           
        </div>
    );
};

export default AItutorials;
