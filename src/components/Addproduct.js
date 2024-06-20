import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../firebaseConfig"; // Ensure you have storage exported from firebaseConfig
import { useNavigate } from "react-router-dom";
import { MultiSelect } from "react-multi-select-component";

const AddProduct = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [catalogs, setCatalogs] = useState([]);
    const [selectedCatalogs, setSelectedCatalogs] = useState([]);
    const [image, setImage] = useState(null);
    const [tags, setTags] = useState("");
    const [link, setLink] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCatalogs = async () => {
            const querySnapshot = await getDocs(collection(db, "catalogs"));
            const catalogsList = querySnapshot.docs.map(doc => ({ label: doc.data().name, value: doc.id }));
            setCatalogs(catalogsList);
        };
        fetchCatalogs();
    }, []);

    const handleImageUpload = async (file) => {
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let imageUrl = "";
            if (image) {
                imageUrl = await handleImageUpload(image);
            }

            const user = auth.currentUser;
            if (user) {
                await addDoc(collection(db, "products"), {
                    name,
                    description,
                    catalogs: selectedCatalogs.map(cat => cat.value), // Save selected catalog IDs
                    imageUrl,
                    tags: tags.split(","),
                    link,
                    status: "pending",
                    createdAt: new Date(),
                    uid: user.uid,
                });

                setMessage("Product added successfully. Awaiting approval.");
                setSelectedCatalogs([]); // Reset selected catalogs
                setName("");
                setDescription("");
                setTags("");
                setLink("");
                setImage(null);
            } else {
                setMessage("User is not logged in");
            }
        } catch (error) {
            setMessage("An error occurred. Please try again.");
        }
    };

    return (
        <div className="auth-container">
            <h2>Add Product</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <MultiSelect
                    options={catalogs}
                    value={selectedCatalogs}
                    onChange={setSelectedCatalogs}
                    labelledBy="Select Catalogs"
                    hasSelectAll={false}
                />
                <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={(e) => setImage(e.target.files[0])}
                />
                <input
                    type="text"
                    placeholder="Tags (comma separated)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Product Link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    required
                />
                <button type="submit">Create</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AddProduct;
