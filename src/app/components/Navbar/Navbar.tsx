"use client";
import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button } from "@nextui-org/react";
import { Slack, User } from "lucide-react";
import { ThemeSwitcher } from "../ThemeSwitcher/ThemeSwitcher";
import { useSession } from "next-auth/react";
import UserDropDown from "./_components/UserDropDown";

export default function App() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand className="flex gap-1">
          <Link className="text-inherit flex gap-1" href="/">
            <Slack size={30} />
            <p className="font-bold text-inherit text-xl">PurePick</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="/scan-and-check" aria-current="page">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/about">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
        {status === "loading" ? (<div></div>) :
          (
            status === "authenticated" ? (
              <UserDropDown />
            ) : (
              <>
                <NavbarItem className="hidden lg:flex">
                  <Link href="/login">Login</Link>
                </NavbarItem>
                <NavbarItem>
                  <Button as={Link} color="primary" href="/signup" variant="flat">
                    Sign Up
                  </Button>
                </NavbarItem>
              </>
            )
          )
        }
      </NavbarContent >
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
              }
              className="w-full"
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar >
  );
}