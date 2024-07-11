import { useState, useEffect } from "react";
import axios from "axios";
import Title from "../ui/Title";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Tables = () => {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await axios.get("/api/tables");
        setTables(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTables();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "deactive" : "active";
      console.log(`Toggling status for table ID ${id} from ${currentStatus} to ${newStatus}`);
      const res = await axios.put(`/api/tables/${id}`, { status: newStatus });
      console.log('API response:', res.data);
      setTables(tables.map(table => (table._id === id ? { ...table, status: newStatus } : table)));
      toast.success("Cập nhật trạng thái thành công");
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  return (
    <div className="lg:p-8 p-4 flex-1 lg:mt-0 relative min-h-[400px] lg:max-w-[70%] xl:max-w-none flex flex-col justify-center bg-white-50 rounded-lg shadow-lg">
      <Title addClass="text-[40px] text-center text-black">Quản Lý Bàn</Title>
      <ToastContainer />
      <div className="overflow-x-auto table-container mt-5">
        <table className="w-full text-sm text-center text-gray-900">
          <thead className="text-xs text-gray-900 uppercase bg-gray-200">
            <tr>
              <th scope="col" className="py-3 px-6">ID</th>
              <th scope="col" className="py-3 px-6">Tên Bàn</th>
              <th scope="col" className="py-3 px-6">Trạng Thái</th>
              <th scope="col" className="py-3 px-6">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {tables.length > 0 ? (
              tables.map((table) => (
                <tr
                  className="bg-white border-b transition hover:bg-gray-100"
                  key={table._id}
                >
                  <td className="py-4 px-6 font-medium whitespace-nowrap">
                    {table._id ? `${table._id.substring(0, 5)}...` : "N/A"}
                  </td>
                  <td className="py-4 px-6 font-medium whitespace-nowrap">
                    {table.tableName}
                  </td>
                  <td className="py-4 px-6 font-medium whitespace-nowrap">
                    {table.status === "active" ? (
                      <span className="text-green-600">Đang hoạt động</span>
                    ) : (
                      <span className="text-red-600">Không hoạt động</span>
                    )}
                  </td>
                  <td className="py-4 px-6 font-medium whitespace-nowrap">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={table.status === "active"}
                        onChange={() => toggleStatus(table._id, table.status)}
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-600 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 px-6 font-medium whitespace-nowrap">
                  Không có bàn nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tables;
