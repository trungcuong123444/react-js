import React, { useState } from "react";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null);
    const [tags, setTags] = useState("");
    const [link, setLink] = useState("");
    const [rating, setRating] = useState(0);
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
                    tags: tags.split(",").map(tag => tag.trim()),
                    link,
                    rating,
                    status: "pending",
                    createdAt: new Date(),
                    uid: user.uid,
                });

                setMessage("Bạn đã đề nghị thêm sản phẩm thành công. Xin đợi xét duyệt.");
            } else {
                setMessage("User is not logged in");
            }
        } catch (error) {
            console.error("Error adding product: ", error);
            setMessage("Đã có lỗi xảy ra. Vui lòng thử lại.");
        }
    };

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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Mô tả"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Danh mục"
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
                    placeholder="Tags (phân tách bằng dấu phẩy)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Liên kết sản phẩm"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    required
                />
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
        </div>
    );
};

export default AddProduct;
