import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../firebaseConfig"; // Ensure firebaseConfig exports db, storage, and auth
import { useNavigate } from "react-router-dom";
import { MultiSelect } from "react-multi-select-component";
import "../css/addproduct.css";
import { Link } from "react-router-dom";

const AddProduct = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [catalogs, setCatalogs] = useState([]);
    const [selectedCatalogs, setSelectedCatalogs] = useState([]);
    const [image, setImage] = useState(null);
    const [tags, setTags] = useState("");
    const [link, setLink] = useState("");
    const [message, setMessage] = useState("");
    const [features, setFeatures] = useState({
        waitlist: false,
        openSource: false,
        mobileApp: false,
        discordCommunity: false,
        api: false,
        noSignupRequired: false,
        browserExtension: false,
    });
    const navigate = useNavigate();

    // Fetch product categories from Firestore
    useEffect(() => {
        const fetchCatalogs = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "catalogs"));
                const catalogsList = querySnapshot.docs.map(doc => ({
                    label: doc.data().name,
                    value: doc.id,
                }));
                setCatalogs(catalogsList);
            } catch (error) {
                console.error("Error fetching catalogs:", error);
            }
        };
        fetchCatalogs();
    }, []);

    // Upload image to Firebase Storage and get the URL
    const handleImageUpload = async (file) => {
        if (!file) {
            console.error("No file selected");
            return "";
        }

        try {
            const storageRef = ref(storage, `images/${file.name}`);
            const uploadResult = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(uploadResult.ref);
            return downloadURL;
        } catch (error) {
            console.error("Error uploading image: ", error);
            setMessage("Error uploading image. Please try again.");
            return "";
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let imageUrl = "";
            if (image) {
                imageUrl = await handleImageUpload(image);
                if (!imageUrl) {
                    setMessage("Error uploading image. Please try again.");
                    return;
                }
            }

            const user = auth.currentUser;
            if (user) {
                await addDoc(collection(db, "products"), {
                    name,
                    description,
                    catalogs: selectedCatalogs.map(cat => cat.value),
                    imageUrl,
                    tags: tags.split(","),
                    link,
                    status: "pending",
                    createdAt: new Date(),
                    uid: user.uid,
                    features,
                });

                const now = new Date();
                const formattedTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                setMessage(`Product added successfully at ${formattedTime}.`);
                setName("");
                setDescription("");
                setSelectedCatalogs([]);
                setImage(null);
                setTags("");
                setLink("");
            } else {
                setMessage("User is not logged in.");
            }
        } catch (error) {
            console.error("Error adding product:", error);
            setMessage("An error occurred. Please try again.");
        }
    };

    const handleFeatureChange = (feature) => {
        setFeatures(prevFeatures => ({
            ...prevFeatures,
            [feature]: !prevFeatures[feature],
        }));
    };

    return (
        <div className="Addproducts-container">
            <div className="w3-sidebar w3-light-grey w3-bar-block" style={{ width: '13%' }}>
                <h3 className="w3-bar-item">Doanh nghiệp</h3>
                <Link to="/" className="w3-bar-item w3-button">Home</Link>
                <Link to="/addproduct" className="w3-bar-item w3-button">AddProduct</Link>
                <Link to="/addcatalog" className="w3-bar-item w3-button">AddCatalog</Link>
                <Link to="/userproduct" className="w3-bar-item w3-button">UserProduct</Link>
            </div>
            <div className="add-product-form">
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
                    <div className="checkbox">
                        {Object.keys(features).map(feature => (
                            <label key={feature}>
                                <input
                                    type="checkbox"
                                    checked={features[feature]}
                                    onChange={() => handleFeatureChange(feature)}
                                />{" "}
                                {feature}
                            </label>
                        ))}
                    </div>
                    <button type="submit">Create</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default AddProduct;
