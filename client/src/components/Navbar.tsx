import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUser"); 
    navigate("/", { replace: true }); 
  };

  return (
    <nav className="bg-gray-900 text-white px-20 py-3 flex justify-between items-center">
      <span className="text-lg">Quản Lý Dự Án</span>
      <div className="flex gap-8 text-sm">
        <NavLink to="/app/allTask">Dự Án</NavLink>
        <NavLink to="/app/project">Nhiệm Vụ của tôi</NavLink>
        <button onClick={handleLogout} className="hover:underline">
          Đăng Xuất
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
