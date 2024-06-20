import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../firebaseConfig"; // Make sure to export storage from firebaseConfig
import { useNavigate } from "react-router-dom";
import { MultiSelect } from "react-multi-select-component";

const AddProduct = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [categories, setCategories] = useState([]);
    const [otherCategory, setOtherCategory] = useState("");
    const [image, setImage] = useState(null);
    const [tags, setTags] = useState("");
    const [link, setLink] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

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

            const selectedCategories = otherCategory ? [...categories.map(cat => cat.value), otherCategory] : categories.map(cat => cat.value);

            const user = auth.currentUser;
            if (user) {
                await addDoc(collection(db, "products"), {
                    name,
                    description,
                    categories: selectedCategories, // Changed 'category' to 'categories'
                    imageUrl,
                    tags: tags.split(","),
                    link,
                    status: "pending", // Initial status
                    createdAt: new Date(),
                    uid: user.uid, // Save the user's UID
                });

                setMessage("Bạn đã đề nghị thêm sản phẩm thành công. Xin đợi xét duyệt.");
                setCategories([]); // Reset categories
                setOtherCategory(""); // Reset other category
                setName("");
                setDescription("");
                setTags("");
                setLink("");
                setImage(null);
            } else {
                setMessage("User is not logged in");
            }
        } catch (error) {
            setMessage("Đã có lỗi xảy ra. Vui lòng thử lại.");
        }
    };

    const options = [
        { label: "Natural Language Processing", value: "Natural Language Processing" },
        { label: "Computer Vision", value: "Computer Vision" },
        { label: "Robotics", value: "Robotics" },
        { label: "Reinforcement Learning", value: "Reinforcement Learning" },
        { label: "Generative Models", value: "Generative Models" },
        { label: "Data Science", value: "Data Science" },
        { label: "AI Ethics", value: "AI Ethics" },
        { label: "Other", value: "Other" }
    ];

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
                    options={options}
                    value={categories}
                    onChange={setCategories}
                    labelledBy="Select Categories"
                    hasSelectAll={false}
                />
                {categories.some(category => category.value === "Other") && (
                    <input
                        type="text"
                        placeholder="Please specify"
                        value={otherCategory}
                        onChange={(e) => setOtherCategory(e.target.value)}
                        required
                    />
                )}
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