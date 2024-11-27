import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { IoChevronDownSharp } from "react-icons/io5";
import { IoChevronUpOutline } from "react-icons/io5";
interface SubMenuItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarLinkProps {
  href?: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
  subMenu?: SubMenuItem[];
}

export const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
  subMenu,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpenSubMenu, setIsOpenSubMenu] = useState<boolean>(false);
  const isActive =
    pathname === href || (pathname === "/dashboard" && href === "/dashboard");
  const handleClick = () => {
    if (subMenu) {
      setIsOpenSubMenu((prev) => !prev);
    } else if (href) {
      router.push(href);
    }
  };
  return (
    <div className="w-full ">
      <div
        className={`cursor-pointer flex items-center ${
          isCollapsed ? "justify-center py-4" : "justify-start pl-8 pr-4 py-4"
        } hover:text-blue-500 hover:bg-blue-100 gap-3 transition-colors ${
          isActive ? "bg-blue-200 text-white" : ""
        }`}
        onClick={handleClick}
      >
        <Icon className="w-6 h-6 !text-gray-700" />
        <span
          className={`${
            isCollapsed ? "hidden" : "block"
          } font-medium text-slate-900 text-base select-none`}
        >
          {label}
        </span>
        {subMenu ? (
          isOpenSubMenu ? (
            <IoChevronUpOutline
              className={`${
                isCollapsed ? "hidden" : "block"
              }  w-4 h-4 text-slate-900 ml-auto`}
            />
          ) : (
            <IoChevronDownSharp
              className={`${
                isCollapsed ? "hidden" : "block"
              }  w-4 h-4 text-slate-900 ml-auto`}
            />
          )
        ) : null}
      </div>
      {subMenu && isOpenSubMenu && (
        <div className={`${isCollapsed ? "hidden" : "block"} mt-2 w-full`}>
          {subMenu.map((item) => (
            <div
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`h-12 pl-12 flex items-center gap-3 px-4  hover:bg-blue-100 hover:text-blue-500 ${
                pathname === item.href ? "bg-blue-200 text-white" : ""
              } cursor-pointer`}
            >
              <item.icon className="w-5 h-5 text-gray-700" />
              <span className="font-base font-semibold text-base text-gray-700 select-none">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
