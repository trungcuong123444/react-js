import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../firebaseConfig"; // Ensure you have storage exported from firebaseConfig
import { useNavigate } from "react-router-dom";
import { MultiSelect } from 'react-multi-select-component';
import '../css/addproduct.css';

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
                const isAdmin = user.email === "admin@gmail.com" && user.password === "123456"; // This line assumes you have access to the password directly which is not recommended

                await addDoc(collection(db, "products"), {
                    name,
                    description,
                    catalogs: selectedCatalogs.map(cat => cat.value), 
                    imageUrl,
                    tags: tags.split(","),
                    link,
                    status: "pending", // Initial status
                    createdAt: new Date(),
                    uid: user.uid, // Save the user's UID
                    features: {
                        waitlist: features.waitlist,
                        openSource: features.openSource,
                        mobileApp: features.mobileApp,
                        discordCommunity: features.discordCommunity,
                        api: features.api,
                        noSignupRequired: features.noSignupRequired,
                        browserExtension: features.browserExtension,
                    },
                });

                setMessage("Bạn đã đề nghị thêm sản phẩm thành công.");
            } else {
                setMessage("User is not logged in");
            }
        } catch (error) {
            setMessage("Đã có lỗi xảy ra. Vui lòng thử lại.");
        }
    };

    const handleFeatureChange = (feature) => {
        setFeatures(prevFeatures => ({
            ...prevFeatures,
            [feature]: !prevFeatures[feature],
        }));
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

                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={features.waitlist}
                            onChange={() => handleFeatureChange('waitlist')}
                        /> Waitlist
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={features.openSource}
                            onChange={() => handleFeatureChange('openSource')}
                        /> Open Source
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={features.mobileApp}
                            onChange={() => handleFeatureChange('mobileApp')}
                        /> Mobile App
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={features.discordCommunity}
                            onChange={() => handleFeatureChange('discordCommunity')}
                        /> Discord Community
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={features.api}
                            onChange={() => handleFeatureChange('api')}
                        /> API
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={features.noSignupRequired}
                            onChange={() => handleFeatureChange('noSignupRequired')}
                        /> No Signup Required
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={features.browserExtension}
                            onChange={() => handleFeatureChange('browserExtension')}
                        /> Browser Extension
                    </label>
                </div>

                <button type="submit">Create</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AddProduct;
