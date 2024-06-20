import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebaseConfig";
import { useParams, useNavigate } from "react-router-dom";
import { MultiSelect } from "react-multi-select-component";

const UpdateProduct = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [categories, setCategories] = useState([]);
    const [otherCategory, setOtherCategory] = useState("");
    const [tags, setTags] = useState("");
    const [link, setLink] = useState("");
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            const docRef = doc(db, "products", productId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const productData = docSnap.data();
                setProduct(productData);
                setName(productData.name);
                setDescription(productData.description);
                setCategories(productData.categories.map(category => ({ label: category, value: category })));
                setTags(productData.tags.join(", "));
                setLink(productData.link);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleImageUpload = async (file) => {
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
    
        try {
            let imageUrl = product.imageUrl;
            if (image) {
                imageUrl = await handleImageUpload(image);
            }
    
            const productRef = doc(db, "products", productId);
            await updateDoc(productRef, {
                name,
                description,
                categories: categories.map(cat => cat.value),
                imageUrl,
                tags: tags.split(","),
                link,
                updatedAt: new Date(),
            });
    
            setMessage("Update thành công"); // Set thông báo sau khi cập nhật thành công
    
            // Chuyển hướng về trang UserProduct sau khi cập nhật thành công
            setTimeout(() => {
                navigate("/userproduct");
            }, 1000); // Chuyển hướng sau 1 giây
    
        } catch (error) {
            console.error("Error updating document: ", error);
            setMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
    };
    

    if (!product) {
        return <p>Loading...</p>;
    }

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
            <h2>Update Product</h2>
            <form onSubmit={handleUpdate}>
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
                <button type="submit">Update</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UpdateProduct;
