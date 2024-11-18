"use client";
import React from "react";
import LoginForm from "./loginForm";
import { useRouter } from "next/navigation";
import { MoveLeft } from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { translations } from "@/constants/language/translation";

type Props = {};
const LoginPage = (props: Props) => {
  const router = useRouter();
  const language = useAppSelector((state) => state.global.language);

  // handle backto home
  const handleBackToHome = () => {
    router.push("/home");
  };
  return (
    <div className="h-screen w-full flex px-3 md:pl-12 relative md:flex md:flex-row bg-[#fff]">
      {/* Image */}
      <div className="w-full md:w-[45%] h-full md:relative md:z-auto">
        <img
          src="/background_auth.png"
          alt="Example"
          className="w-full h-full object-cover md:static top-0 left-0 z-0"
        />
        <span className="hidden md:flex md:absolute top-1/2 left-[18%] text-3xl font-bold text-[#ffffff] uppercase w-full max-w-[400px] text-center break-words">
          {language === "en"
            ? translations.en.auth_page_slogan
            : translations.vi.auth_page_slogan}
        </span>
      </div>
      {/* Login Form */}
      <div className="w-full md:flex-1 h-full flex flex-col gap-3 absolute items-center justify-center md:relative z-10 md:z-auto ">
        <div className="w-[60%] h-14 flex items-center pl-6 gap-5">
          <MoveLeft
            onClick={handleBackToHome}
            className="cursor-pointer text-[#ffffff] md:text-[#121212]"
          />
          <span className="text-xl font-semibold text-[#ffffff] md:text-[#121212]">
            {language === "en"
              ? translations.en.back_to_home
              : translations.vi.back_to_home}
          </span>
        </div>
        <div className="border-[2px] rounded-lg shadow-md shadow-[#bdc3c7] w-[70%] h-[380px] bg-[#dfe6e9] md:bg-transparent">
          <LoginForm language={language} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
