import React, { useState, useEffect } from "react";
import { BrandLogoIcon, EyeIcon, EyeOffIcon, MoonIcon, SunIcon } from "./icons";
import ApiService from "@/src/apiService";

interface LoginPageProps {
  onLoginSuccess: () => void;
  onShowToast: (
    message: string,
    type: "success" | "error",
    onCloseCallback?: () => void,
  ) => void;
  theme: string;
  setTheme: (theme: "light" | "dark") => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onShowToast,
  theme,
  setTheme,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Set default theme to light on component mount if not set
  useEffect(() => {
    if (!localStorage.getItem("theme")) {
      setTheme("light");
    }
  }, [setTheme]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = username.trim();
    const cleanPass = password.trim();
    const cleanOtp = otp.trim();

    if (!cleanPhone || !cleanPass || cleanOtp.length !== 6) {
      setError("شماره موبایل، رمز عبور و کد ۶ رقمی گوگل الزامی است.");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      // ارسال درخواست ورود با کتابخانه Axios به بک‌اند جنگو
      await ApiService.auth.login({
        phone: cleanPhone,
        password: cleanPass,
        otp: cleanOtp,
      });

      onShowToast(
        "شما با موفقیت وارد اکانت مدیریت خود شدید",
        "success",
        onLoginSuccess,
      );
    } catch (err: unknown) {
      console.error("خطای ورود جنگو:", err);
      let errorMsg = "مشخصات یا کد ۶ رقمی احراز هویت گوگل نادرست است.";

      const axiosErr = err as { response?: { data?: { detail?: string; message?: string; non_field_errors?: string[] | string } } };
      if (axiosErr?.response?.data?.detail) {
        errorMsg = axiosErr.response.data.detail;
      } else if (axiosErr?.response?.data?.message) {
        errorMsg = axiosErr.response.data.message;
      } else if (axiosErr?.response?.data?.non_field_errors) {
        errorMsg = Array.isArray(axiosErr.response.data.non_field_errors)
          ? axiosErr.response.data.non_field_errors.join(" ")
          : axiosErr.response.data.non_field_errors;
      }

      setError(errorMsg);
      onShowToast(errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };



  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const isFormEmpty = !username.trim() || !password.trim() || otp.length !== 6;

  return (
    <div
      className="bg-[#F7F8FA] dark:bg-gray-900 min-h-screen flex items-center justify-center p-4 lg:p-8"
      style={{
        backgroundImage:
          "radial-gradient(var(--gradient-color) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <style>{`:root { --gradient-color: ${theme === "light" ? "#E9EBF0" : "#374151"}; }`}</style>
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 bg-white dark:bg-gray-800 p-3 rounded-full shadow-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        {theme === "light" ? (
          <MoonIcon className="w-6 h-6" />
        ) : (
          <SunIcon className="w-6 h-6" />
        )}
      </button>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Form Side */}
        <div className="lg:col-span-6 flex flex-col justify-center w-full max-w-md mx-auto">
          <div className="flex items-center justify-start gap-4 mb-6">
            <BrandLogoIcon className="w-20 h-20" />
            <div className="text-right">
              <h1 className="font-bold text-lg text-gray-800 dark:text-gray-200">
                سفرنامه 24
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                CRM safarnameh24
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 mt-2">
            <h2 className="text-xl font-bold text-right text-gray-900 dark:text-gray-100">
              ورود به پنل ادمین سفرنامه 24
            </h2>
            <p className="text-right text-gray-500 dark:text-gray-400 mt-1 text-sm">
              به پنل مدیریت سفرنامه 24 خوش آمدید!
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
              <div>
                <label
                  htmlFor="username"
                  className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  شماره موبایل
                </label>
                <input
                  id="username"
                  name="username"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^0-9]/g, "");
                    setUsername(numericValue);
                    setError("");
                  }}
                  className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-violet-500 text-right text-gray-900 dark:text-gray-100 text-sm"
                  placeholder="شماره موبایل"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  رمز عبور
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-violet-500 text-right pr-3 pl-10 text-gray-900 dark:text-gray-100 text-sm"
                    placeholder="رمز عبور را وارد نمایید..."
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Toggle password visibility"
                  >
                    {passwordVisible ? (
                      <EyeOffIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="otp"
                  className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  کد احراز هویت گوگل (OTP 6 رقمی)
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => {
                    const numericValue = e.target.value
                      .replace(/[^0-9]/g, "")
                      .slice(0, 6);
                    setOtp(numericValue);
                    setError("");
                  }}
                  className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-violet-500 text-center tracking-widest text-base font-semibold text-gray-900 dark:text-gray-100"
                  placeholder="------"
                />
              </div>

              {error && (
                <p className="text-xs text-red-600 text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading || isFormEmpty}
                className="w-full bg-[#6644F0] text-white font-bold py-3.5 px-4 rounded-lg hover:bg-[#5533E0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6644F0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? "در حال ورود..." : "ورود به پنل کاربری"}
              </button>


            </form>
          </div>
        </div>
        {/* Illustration Side */}
        <div className="hidden lg:flex lg:col-span-6 flex-col items-center justify-center bg-gradient-to-br from-[#6644F0] to-[#5533E0] rounded-3xl p-12 text-white h-[640px] shadow-2xl relative overflow-hidden">
          {/* Background Glow Ellipses matching Figma */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-400/45 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-indigo-300/30 rounded-full blur-2xl pointer-events-none"></div>

          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-purple-900/30 pointer-events-none"></div>
          <img
            src="/image24.png"
            alt="safarnameh24 Illustration"
            className="w-full max-w-md object-contain drop-shadow-2xl relative z-10 transition-transform duration-500 hover:scale-105 mix-blend-luminosity"
          />
          <h2 className="text-xl font-bold mt-8 text-center relative z-10">
            مدیریت رزروها و مشتریان، آسان‌تر از همیشه
          </h2>
          <p className="mt-4 text-center text-indigo-200 max-w-md text-sm leading-relaxed relative z-10">
            مدیریت رزرواسیون، ارتباط با مهمانان و پایش عملکرد هتل خود را در یک
            داشبورد هوشمند تجربه کنید؛ با داده‌های دقیق، رابط کاربری روان و
            تصمیم‌گیری سریع‌تر از همیشه
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
