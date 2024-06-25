import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate, Link } from "react-router-dom";
import "../css/login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const provider = new GoogleAuthProvider();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Đăng nhập bằng email và password
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // Lấy thông tin người dùng từ userCredential
            const user = userCredential.user;

            // Kiểm tra xem email và password có trùng với admin@gmail.com và 123456 không
            if (user.email === "admin@gmail.com" && password === "123456") {
                // Chuyển hướng đến trang admin.js nếu là admin
                navigate("/Admin");
            } else {
                // Nếu không phải admin, chuyển hướng về trang chủ
                navigate("/");
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, provider);
            navigate("/"); // Chuyển hướng đến trang chủ sau khi đăng nhập thành công
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="Login-container">
            <h2>Login 🥱😫😪</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Nhập đúng mật khẩu để không sai"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
            <button onClick={handleGoogleLogin}>Login with Google</button>
            {error && <p>{error}</p>}
            
            <p>Don't have an account? <Link to="/register">Register now</Link></p>
        </div>
    );
};

export default Login;
