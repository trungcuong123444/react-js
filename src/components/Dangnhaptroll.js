import React, { useState } from "react";
import "../css/Dangnhaptroll.css"; // Đảm bảo bạn đã tạo file CSS

const Dangnhaptroll = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [position, setPosition] = useState({ top: '50%', left: '50%' });

    // Hàm tạo vị trí ngẫu nhiên
    const getRandomPosition = () => {
        const x = Math.random() *80 + 10; // Random từ 10% đến 90% trên trục X
        const y = Math.random() * 80 + 10; // Random từ 10% đến 90% trên trục Y
        return { top: `${y}%`, left: `${x}%` };
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
        setPosition(getRandomPosition()); // Cập nhật vị trí khi hover
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div className="dangnhap-container">
            <h2>Đăng Nhập </h2>
            <p>Nhấn nút đăng nhập để kết nối với hệ thống   😆</p>
            <button
                className={`login-btn ${isHovered ? "hovered" : ""}`}
                style={{ top: position.top, left: position.left }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                disabled={isHovered} // Vô hiệu hóa nút khi hover
            >
                Đăng Nhập
            </button>
        </div>
    );
};

export default Dangnhaptroll;
