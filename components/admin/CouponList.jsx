import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CouponForm from './CouponForm';
import Swal from 'sweetalert2';
import { GiCancel } from "react-icons/gi";

const CouponList = () => {
    const [coupons, setCoupons] = useState([]);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const updateCouponStatus = async (coupons) => {
        const currentDate = new Date();

        for (let coupon of coupons) {
            let newStatus;
            if (currentDate < new Date(coupon.startDate)) {
                newStatus = 'deactive';
            } else if (currentDate >= new Date(coupon.startDate) && currentDate <= new Date(coupon.expirationDate)) {
                newStatus = 'active';
            } else {
                newStatus = 'outdate';
            }

            if (coupon.couponStatus !== newStatus) {
                coupon.couponStatus = newStatus;
                try {
                    await axios.put(`/api/coupons/${coupon._id}`, { couponStatus: newStatus });
                } catch (error) {
                    console.error(`Error updating coupon status for ${coupon._id}:`, error);
                }
            }
        }

        return coupons;
    };

    const fetchCoupons = async () => {
        try {
            const response = await axios.get('/api/coupons');
            let coupons = response.data.data;

            // Update coupon statuses
            coupons = await updateCouponStatus(coupons);

            setCoupons(coupons);
        } catch (error) {
            console.error('Error fetching coupons:', error);
        }
    };

    useEffect(() => {
        fetchCoupons();
        const intervalId = setInterval(fetchCoupons, 1000); // 10000ms = 10s
        return () => clearInterval(intervalId); // Cleanup interval on unmount
    }, []);

    const handleEdit = (coupon) => {
        setEditingCoupon(coupon);
        setIsFormVisible(true);
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa mã giảm giá này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/api/coupons/${id}`);
                    fetchCoupons();
                    Swal.fire('Thành công', 'Đã xóa mã giảm giá', 'success');
                } catch (error) {
                    Swal.fire('Thất bại', 'Không thể xóa mã giảm giá', 'error');
                }
            }
        });
    };

    const openForm = () => {
        setEditingCoupon(null);
        setIsFormVisible(true);
    };

    const closeForm = () => {
        setIsFormVisible(false);
        setEditingCoupon(null);
    };

    return (
        <div className="container mx-auto p-4 relative">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Quản lý mã giảm giá</h1>
            </div>
            <button
                onClick={openForm}
                className="btn-green w-40 h-12 !p-0 bottom-14 right-14 text-center absolute bg-green-500 hover:bg-green-400 text-white rounded-full shadow-lg transition duration-300"
            >
                Thêm mã
            </button>
            {isFormVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded shadow-md w-full max-w-lg relative">
                        <button
                            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-all"
                            onClick={() => {
                                if (confirm("Bạn có chắc chắn muốn thoát không?")) {
                                    closeForm();
                                }
                            }}
                        >
                            <GiCancel size={25} className="transition-all" />
                        </button>
                        <CouponForm onSave={fetchCoupons} editingCoupon={editingCoupon} setEditingCoupon={setEditingCoupon} closeForm={closeForm} />
                    </div>
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 mt-6">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b">Mã Giảm Giá</th>
                            <th className="px-4 py-2 border-b">Giá trị %</th>
                            <th className="px-4 py-2 border-b">Giá trị tối đa</th>
                            <th className="px-4 py-2 border-b">Ngày Bắt đầu</th>
                            <th className="px-4 py-2 border-b">Ngày Hết Hạn</th>
                            <th className="px-4 py-2 border-b">Loại Danh mục</th>
                            <th className="px-4 py-2 border-b">Trạng thái</th>
                            <th className="px-4 py-2 border-b">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map((coupon) => (
                            <tr key={coupon._id} className="border-t">
                                <td className="px-4 py-2">{coupon.code}</td>
                                <td className="px-4 py-2">{coupon.percentageValue} %</td>
                                <td className="px-4 py-2">{coupon.maxDiscountValue} vnđ</td>
                                <td className="px-4 py-2">{new Date(coupon.startDate).toLocaleDateString()}</td>
                                <td className="px-4 py-2">{new Date(coupon.expirationDate).toLocaleDateString()}</td>
                                <td className="px-4 py-2">{coupon.applicableCategory.title}</td>
                                <td className={`px-4 py-2 ${getStatusColor(coupon.couponStatus)}`}>{getStatusText(coupon.couponStatus)}</td>
                                <td className="px-5 py-2 flex space-x-2">
                                    <button onClick={() => handleEdit(coupon)} className="bg-yellow-500 text-white px-2 py-1 rounded">
                                        Sửa
                                    </button>
                                    <button onClick={() => handleDelete(coupon._id)} className="bg-red-500 text-white px-2 py-1 rounded">
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const getStatusColor = (status) => {
    switch (status) {
        case 'active':
            return 'text-green-600';
        case 'deactive':
            return 'text-yellow-600';
        case 'outdate':
            return 'text-red-600';
        default:
            return '';
    }
};

const getStatusText = (status) => {
    switch (status) {
        case 'active':
            return 'Đang hoạt động';
        case 'deactive':
            return 'Chưa kích hoạt';
        case 'outdate':
            return 'Hết hạn';
        default:
            return status;
    }
};

export default CouponList;
