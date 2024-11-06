"use client";
import React from "react";
import { useRouter } from "next/navigation";

type Props = {};

const HomePage = (props: Props) => {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/auth/login");
  };

  return (
    <div>
      HomePage
      <button onClick={handleLoginClick}>Login</button>
    </div>
  );
};

export default HomePage;
