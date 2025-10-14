import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Outlet /> 
    </div>
  );
};

export default AuthLayout;
