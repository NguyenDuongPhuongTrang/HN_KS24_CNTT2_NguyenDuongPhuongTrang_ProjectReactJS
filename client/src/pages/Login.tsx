import { useState, useEffect } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useDispatch } from "react-redux";
import { loginUser } from "../store/authSlice";
import type { AppDispatch } from "../store/store";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (user) {
      navigate("/app/project", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!formData.email.trim()) {
      toast.error("Vui lòng nhập email");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Email không hợp lệ");
      return false;
    }
    if (!formData.password.trim()) {
      toast.error("Vui lòng nhập mật khẩu");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await dispatch(loginUser(formData));

    if (loginUser.fulfilled.match(result)) {
      localStorage.setItem("user", JSON.stringify(result.payload));
      toast.success(`Đăng nhập thành công`);
      navigate("/app/project");
    } else {
      toast.error(result.payload || "Đăng nhập thất bại");
    }
  };

  return (
    <>
      <h1 className="text-2xl font-semibold text-center mb-10 text-5xl">
        Đăng nhập
      </h1>
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-poppins">
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="Địa chỉ email"
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            label="Mật khẩu"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mật khẩu"
          />

          <Button
            type="submit"
            className="bg-[#0D6EFD] hover:bg-blue-700 py-4 mt-6 text-white"
            text="Đăng nhập"
          />
        </form>

        <p className="text-center text-sm text-gray-600 mt-3">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </>
  );
};

export default Login;
