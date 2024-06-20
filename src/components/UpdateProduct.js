import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebaseConfig";
import { useParams, useNavigate } from "react-router-dom";

const UpdateProduct = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");
    const [link, setLink] = useState("");
    const [image, setImage] = useState(null);
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
                setCategory(productData.category);
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
                category,
                imageUrl,
                tags: tags.split(","),
                link,
                updatedAt: new Date(),
            });

            navigate("/userproducts"); // Chuyển hướng về trang UserProduct sau khi cập nhật thành công
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    if (!product) {
        return <p>Loading...</p>;
    }

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
                <button type="submit">Update</button>
            </form>
        </div>
    );
};

export default UpdateProduct;
