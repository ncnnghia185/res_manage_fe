"use client";
import React from "react";
import LoginForm from "./loginForm";
import { MenuItem, Select } from "@mui/material";
import Image from "next/image";
import { setIsDarkMode, setLanguage } from "@/redux/globalState/globalSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { SelectChangeEvent } from "@mui/material/Select";

type Props = {};

const LoginPage = (props: Props) => {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.global.language);
  // change language
  const handleChangeLanguage = (event: SelectChangeEvent) => {
    dispatch(setLanguage(event.target.value));
  };
  return (
    <div className="h-full w-full flex flex-col md:flex-row items-center justify-between px-4 gap-3">
      {/* image */}
      <div className="flex w-[50%] h-full items-center justify-center">
        {/* <Select
          value={language}
          onChange={handleChangeLanguage}
          className="h-9 w-[80%]"
        >
          <MenuItem value="vi" className="flex">
            <div className="h-full w-full flex gap-2 items-center">
              <Image src={"./vi.svg"} alt="vi" width={15} height={15} />
              <span className="text-base font-semibold">vi</span>
            </div>
          </MenuItem>
          <MenuItem value="en">
            <div className="h-full w-full flex gap-2 items-center">
              <Image src={"./en.svg"} alt="vi" width={15} height={15} />
              <span className="text-base font-semibold">en</span>
            </div>
          </MenuItem>
        </Select> */}
      </div>

      <div className="flex w-[50%] h-full items-center justify-center">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
