import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const CouponForm = ({ onSave, editingCoupon, setEditingCoupon, closeForm }) => {
    const [code, setCode] = useState('');
    const [percentageValue, setPercentageValue] = useState('');
    const [maxDiscountValue, setMaxDiscountValue] = useState('');
    const [startDate, setStartDate] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [applicableCategory, setApplicableCategory] = useState('');
    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (editingCoupon) {
            setCode(editingCoupon.code);
            setPercentageValue(editingCoupon.percentageValue);
            setMaxDiscountValue(editingCoupon.maxDiscountValue);
            setStartDate(editingCoupon.startDate.split('T')[0]);  // Extract date part
            setExpirationDate(editingCoupon.expirationDate.split('T')[0]);  // Extract date part
            setApplicableCategory(editingCoupon.applicableCategory._id);
        } else {
            setCode('');
            setPercentageValue('');
            setMaxDiscountValue('');
            setStartDate('');
            setExpirationDate('');
            setApplicableCategory('');
        }
    }, [editingCoupon]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate dates
        if (new Date(expirationDate) <= new Date(startDate)) {
            Swal.fire('Lỗi', 'Ngày hết hạn phải lớn hơn ngày bắt đầu.', 'error');
            return;
        }

        const couponData = {
            code,
            percentageValue: parseFloat(percentageValue),
            maxDiscountValue: parseFloat(maxDiscountValue),
            startDate,
            expirationDate,
            applicableCategory
        };

        try {
            if (editingCoupon) {
                await axios.put(`/api/coupons/${editingCoupon._id}`, couponData);
                Swal.fire('Thành công!', 'Cập nhật mã giảm giá thành công.', 'success');
            } else {
                await axios.post('/api/coupons/add', couponData);
                Swal.fire('Thành công!', 'Thêm mã giảm giá thành công.', 'success');
            }
            onSave();
            closeForm();
            setEditingCoupon(null);
        } catch (error) {
            console.error('Error saving coupon:', error);
            Swal.fire('Thất bại!', 'Lưu mã giảm giá thất bại. Vui lòng thử lại.', 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="mb-4">
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">Mã Giảm Giá</label>
                <input
                    id="code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="percentageValue" className="block text-sm font-medium text-gray-700">Giá trị %</label>
                <input
                    id="percentageValue"
                    type="number"
                    value={percentageValue}
                    onChange={(e) => setPercentageValue(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="maxDiscountValue" className="block text-sm font-medium text-gray-700">Giá trị tối đa</label>
                <input
                    id="maxDiscountValue"
                    type="number"
                    value={maxDiscountValue}
                    onChange={(e) => setMaxDiscountValue(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Ngày Bắt đầu</label>
                <input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700">Ngày Hết Hạn</label>
                <input
                    id="expirationDate"
                    type="date"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="applicableCategory" className="block text-sm font-medium text-gray-700">Chọn Danh Mục</label>
                <select
                    id="applicableCategory"
                    value={applicableCategory}
                    onChange={(e) => setApplicableCategory(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <option value="">Vui Lòng Chọn Danh Mục</option>
                    {categories.map((category) => (
                        <option key={category._id} value={category._id}>{category.title}</option>
                    ))}
                </select>
            </div>
            <div className="flex justify-end">
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700">
                    {editingCoupon ? 'Cập nhật' : 'Thêm mới'}
                </button>
            </div>
        </form>
    );
};

export default CouponForm;
