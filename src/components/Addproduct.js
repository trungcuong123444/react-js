import React, { useState } from "react";
<<<<<<< HEAD
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../firebaseConfig";
=======
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../firebaseConfig"; // Make sure to export storage from firebaseConfig
>>>>>>> 8a39b9b18a971da16d523ea362d6bf9813e52845
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null);
    const [tags, setTags] = useState("");
    const [link, setLink] = useState("");
<<<<<<< HEAD
    const [rating, setRating] = useState(0);
=======
>>>>>>> 8a39b9b18a971da16d523ea362d6bf9813e52845
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

            const user = auth.currentUser;
            if (user) {
                await addDoc(collection(db, "products"), {
                    name,
                    description,
                    category,
                    imageUrl,
<<<<<<< HEAD
                    tags: tags.split(",").map(tag => tag.trim()),
                    link,
                    rating,
                    status: "pending",
                    createdAt: new Date(),
                    uid: user.uid,
=======
                    tags: tags.split(","),
                    link,
                    status: "pending", // Initial status
                    createdAt: new Date(),
                    uid: user.uid, // Save the user's UID
>>>>>>> 8a39b9b18a971da16d523ea362d6bf9813e52845
                });

                setMessage("Bạn đã đề nghị thêm sản phẩm thành công. Xin đợi xét duyệt.");
            } else {
                setMessage("User is not logged in");
            }
        } catch (error) {
<<<<<<< HEAD
            console.error("Error adding product: ", error);
=======
>>>>>>> 8a39b9b18a971da16d523ea362d6bf9813e52845
            setMessage("Đã có lỗi xảy ra. Vui lòng thử lại.");
        }
    };

<<<<<<< HEAD
    const fetchUserProducts = async () => {
        const user = auth.currentUser;
        if (user) {
            const q = query(collection(db, "products"), where("uid", "==", user.uid));
            const querySnapshot = await getDocs(q);
            const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return products;
        }
        return [];
    };

    const handleShowProducts = async () => {
        const products = await fetchUserProducts();
        navigate("/", { state: { products } });
    };

    return (
        <div className="auth-container">
            <h2>Thêm Sản Phẩm</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Tên sản phẩm"
=======
    return (
        <div className="auth-container">
            <h2>Add Product</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
>>>>>>> 8a39b9b18a971da16d523ea362d6bf9813e52845
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <textarea
<<<<<<< HEAD
                    placeholder="Mô tả"
=======
                    placeholder="Description"
>>>>>>> 8a39b9b18a971da16d523ea362d6bf9813e52845
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <input
                    type="text"
<<<<<<< HEAD
                    placeholder="Danh mục"
=======
                    placeholder="Category"
>>>>>>> 8a39b9b18a971da16d523ea362d6bf9813e52845
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
<<<<<<< HEAD
                    placeholder="Tags (phân tách bằng dấu phẩy)"
=======
                    placeholder="Tags (comma separated)"
>>>>>>> 8a39b9b18a971da16d523ea362d6bf9813e52845
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
                <input
                    type="text"
<<<<<<< HEAD
                    placeholder="Liên kết sản phẩm"
=======
                    placeholder="Product Link"
>>>>>>> 8a39b9b18a971da16d523ea362d6bf9813e52845
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    required
                />
<<<<<<< HEAD
                <input
                    type="number"
                    placeholder="Đánh giá (từ 1 đến 5)"
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value))}
                    min="1"
                    max="5"
                    required
                />
                <button type="submit">Tạo</button>
            </form>
            {message && <p>{message}</p>}
            <button onClick={handleShowProducts}>Hiển thị Sản phẩm của tôi</button>
=======
                <button type="submit">Create</button>
            </form>
            {message && <p>{message}</p>}
>>>>>>> 8a39b9b18a971da16d523ea362d6bf9813e52845
        </div>
    );
};

export default AddProduct;
