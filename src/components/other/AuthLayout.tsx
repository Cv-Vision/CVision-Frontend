import { FC, ReactNode } from "react";
import Logo from "./Logo";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  showLogo?: boolean;
}

const AuthLayout: FC<AuthLayoutProps> = ({ title, subtitle, children, showLogo = true }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-100 flex flex-col items-center justify-center py-10 px-4">
      {showLogo && (
        <div className="mb-8">
          <Logo />
        </div>
      )}
      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-teal-600 mb-2">{title}</h1>
          <p className="text-lg text-gray-600">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
