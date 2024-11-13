import BrandLogo from "@/components/BrandLogo";
import Link from "next/link";
import {UserButton} from "@clerk/nextjs";
import React from "react";

function NavBar() {
  return (
    <header className="flex py-4 shadow-sm bg-background">
      <nav className="flex items-center  gap-10 container ">
        <Link className="mr-auto" href="/dashboard">
          <BrandLogo />
        </Link>
        <Link  href="/dashboard/products">
            Products
        </Link>
        <Link href="/dashboard/analytics">
          Analytics
        </Link>
        <Link  href="/dashboard/subscription">
            Subscription
        </Link>
        <UserButton />
      </nav>
    </header>
  );
}

export default NavBar;
