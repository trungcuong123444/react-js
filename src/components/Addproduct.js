//src\components\Addproduct.js
import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../firebaseConfig";


const AddProduct = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null);
    const [tags, setTags] = useState("");
    const [link, setLink] = useState("");
    const [message, setMessage] = useState("");
    

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
                    category,
                    imageUrl,
                    tags: tags.split(","),
                    link,
                    status: isAdmin ? "approved" : "pending", // Set status based on admin check
                    createdAt: new Date(),
                    uid: user.uid, // Save the user's UID
                });

                setMessage("Bạn đã đề nghị thêm sản phẩm thành công.");
            } else {
                setMessage("User is not logged in");
            }
        } catch (error) {
            setMessage("Đã có lỗi xảy ra. Vui lòng thử lại.");
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
                <input
                    type="text"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
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