import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import "../css/ProductInformation.css";
const ProductInformation = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const docRef = doc(db, 'products', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProduct(docSnap.data());
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [id]);

    if (!product) {
        return <p>Loading...</p>;
    }

    const { name, description, catalogs, imageUrl, tags, link, status, createdAt, uid, videoUrl } = product;

    return (
        <div className='Tong'>
        <div className='TTSP'>
            
            <h3><strong>Name:</strong> {name}</h3>
            <div className='Video'>
                <iframe src="https://www.youtube.com/embed/ebKZBJSWR7E?si=UIoNByCTr7qavQ0B" title="YouTube video player" ></iframe>
            </div>
            
            <p  ><strong>Description:</strong> {description}  </p>
            <p><strong>Catalogs:</strong> {catalogs ? catalogs.join(', ') : 'No catalogs'}</p>
            <p><strong>Image URL:<br></br></strong> <img src={imageUrl} alt={name} style={{ maxWidth: '200px' }} /></p>
            <p><strong>Tags:</strong> {tags ? tags.join(', ') : 'No tags'}</p>
            <p><strong>Link:</strong> <a href={link} target="_blank" rel="noopener noreferrer">{link}</a></p>
            <p><strong>Status:</strong> {status}</p>
            <p><strong>Created At:</strong> {createdAt.toDate().toLocaleDateString()}</p>
            <p><strong>UID:</strong> {uid}</p>
        </div>
        
        </div>
        
    );
};

export default ProductInformation;
