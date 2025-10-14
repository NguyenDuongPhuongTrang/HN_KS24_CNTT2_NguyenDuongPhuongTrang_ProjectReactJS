import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useDispatch } from "react-redux";
import { registerUser } from "../store/authSlice";
import type { AppDispatch } from "../store/store";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!formData.userName.trim()) {
      toast.error("Tên đăng nhập không được bỏ trống");
      return false;
    }
    if (!formData.email) {
      toast.error("Email không được bỏ trống");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Email không hợp lệ");
      return false;
    }
    if (!formData.password) {
      toast.error("Mật khẩu không được bỏ trống");
      return false;
    } else if (formData.password.length < 8) {
      toast.error("Mật khẩu phải ít nhất 8 ký tự");
      return false;
    }
    if (!confirmPassword) {
      toast.error("Vui lòng xác nhận mật khẩu");
      return false;
    }
    if (formData.password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    console.log(formData);
    
    dispatch(registerUser(formData))
      .then(() => {
        toast.success("Đăng ký thành công");
        setFormData({ userName: "", email: "", password: "" });
        setConfirmPassword("");
        navigate("/");
      })
      .catch(() => {
        toast.error("Đăng ký thất bại");
      });
  };


  return (
    <>
    <h1 className="text-2xl font-semibold text-center mb-10 text-5xl">Đăng ký</h1>
    <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-poppins">
        <Input
          name="userName"
          placeholder="Họ và Tên"
          value={formData.userName}
          onChange={handleChange}
        />

        <Input
          type="email"
          name="email"
          placeholder="Địa chỉ email"
          value={formData.email}
          onChange={handleChange}
        />

        <Input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
        />

        <Input
            type="password"
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

        <Button
          className="bg-[#0D6EFD] hover:bg-blue-700 py-4 mt-6 text-white"
          type="submit"
          text="Đăng ký"
        />
      </form>

      <p className="text-sm text-center mt-6">
        Đã có tài khoản?{" "}
        <Link to="/" className="text-blue-600 hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
    </>
  );
};

export default Register;
