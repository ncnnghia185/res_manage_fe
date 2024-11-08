"use client";
import * as React from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon: LucideIcon;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  darkTheme?: boolean;
}

const IconBreadcrumbs: React.FC<BreadcrumbProps> = ({ items, darkTheme }) => {
  const router = useRouter();
  const handleClick = (href?: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    if (href) {
      router.push(href);
    }
  };

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {items.map((item, index) => {
        const Icon = item.icon;

        return item.href ? (
          <Link
            key={index}
            underline="hover"
            className="cursor-pointer flex"
            color={darkTheme ? "#ffffff" : "#121212"}
            onClick={handleClick(item.href)}
          >
            <Icon className="mr-0.5 w-5 h-5 font-bold" />
            {item.label}
          </Link>
        ) : (
          <Typography
            key={index}
            sx={{
              color: "text.primary",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Icon className="mr-0.5" fontSize="inherit" />
            {item.label}
          </Typography>
        );
      })}
    </Breadcrumbs>
  );
};

export default IconBreadcrumbs;
