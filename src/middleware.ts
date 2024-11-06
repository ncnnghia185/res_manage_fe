import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const isLoggedIn = req.cookies.get("isLoggedIn"); // Lấy trạng thái đăng nhập từ cookie

  const protectedRoutes = ["/", "/dashboard", "/menu"];

  // Kiểm tra người dùng truy cập vào các route bảo vệ
  if (!isLoggedIn && protectedRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // Xử lý riêng cho trang gốc "/"
  if (req.nextUrl.pathname === "/") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } else {
      return NextResponse.redirect(new URL("/home", req.url));
    }
  }

  return NextResponse.next();
}
