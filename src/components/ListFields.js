import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/ListFields.css'; // Đảm bảo rằng bạn đã tạo file này

const ListFields = () => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [sortBy, setSortBy] = useState('name'); // Sắp xếp mặc định theo tên
    const [filterByRating, setFilterByRating] = useState(null); // Lọc theo rating, null là tất cả
    const [searchTerm, setSearchTerm] = useState('');

    const items = [
        { name: 'Field 1', logo: 'https://via.placeholder.com/150', rating: 4 },
        { name: 'Field 2', logo: 'https://via.placeholder.com/150', rating: 5 },
        { name: 'Field 3', logo: 'https://via.placeholder.com/150', rating: 2 },
        { name: 'Field 4', logo: 'https://via.placeholder.com/150', rating: 3 },
        // Thêm các item khác nếu cần
    ];

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={i <= rating ? 'star filled' : 'star'}>★</span>
            );
        }
        return stars;
    };

    const handleBack = () => {
        navigate('/');
    };

    const handleLogoClick = (field) => {
        navigate('/field-detail', { state: { field } });
    };

    const handleViewClick = (field) => {
        navigate('/field-detail', { state: { field } });
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    const handleFilterChange = (event) => {
        const rating = parseInt(event.target.value);
        setFilterByRating(rating === 0 ? null : rating); // Chuyển đổi 0 thành null để hiển thị tất cả
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = () => {
        // Xử lý tìm kiếm ở đây, có thể là cập nhật lại danh sách items
        alert(`Searching for: ${searchTerm}`);
    };

    // Lọc và sắp xếp items dựa trên các state hiện tại
    let filteredItems = [...items];
    if (filterByRating !== null) {
        filteredItems = filteredItems.filter(item => item.rating === filterByRating);
    }
    if (searchTerm.trim() !== '') {
        filteredItems = filteredItems.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    filteredItems.sort((a, b) => {
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        } else if (sortBy === 'rating') {
            return b.rating - a.rating; // Sắp xếp giảm dần theo rating
        }
        return 0;
    });

    return (
        <div>
            <header>
                <nav>
                    <div className="container">
                        <h1>List Fields</h1>
                        <button onClick={handleBack}>Back to Home</button>
                        <div className="filters">
                            <label>Sort by:</label>
                            <select value={sortBy} onChange={handleSortChange}>
                                <option value="name">Name</option>
                                <option value="rating">Rating</option>
                            </select>
                            <label>Filter by Rating:</label>
                            <select value={filterByRating || '0'} onChange={handleFilterChange}>
                                <option value="0">All</option>
                                <option value="5">★★★★★ & up</option>
                                <option value="4">★★★★ & up</option>
                                <option value="3">★★★ & up</option>
                                <option value="2">★★ & up</option>
                                <option value="1">★ & up</option>
                            </select>
                            <div className="search">
                                <input
                                    type="text"
                                    placeholder="Search by name..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                <button className="search-button" onClick={handleSearchSubmit}>
                                    <i className="fa fa-search"></i> Search
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
            <div className="list-container">
                {filteredItems.map((item, index) => (
                    <div key={index} className="list-item">
                        <div onClick={() => handleLogoClick(item)} className="list-logo-container">
                            <img src={item.logo} alt={`${item.name} logo`} className="list-logo" />
                            <span className="checkmark">✔</span>
                        </div>
                        <div className="list-content">
                            <div onClick={() => handleLogoClick(item)} className="list-name">{item.name}</div>
                            <div className="list-rating">{renderStars(item.rating)}</div>
                            <div className="list-description">
                                <div className="list-trial">Free Trial</div>
                                <div>Multi-chatbot powerhouse for AI tasks.</div>
                                <div className="list-tags">#students #ai #chatbots</div>
                            </div>
                        </div>
                        <div className="list-action">
                            <button className="visit-button" onClick={() => handleViewClick(item)}>
                                Visit <span className="exit-icon">✕</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListFields;
