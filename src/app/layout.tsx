"use client";

import "./globals.css";
import { Provider } from "react-redux"; // Import Provider từ react-redux
import { store } from "@/redux/store"; // Import store Redux của bạn

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
