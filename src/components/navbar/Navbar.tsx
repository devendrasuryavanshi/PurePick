"use client";
import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button } from "@nextui-org/react";
import { Slack, User } from "lucide-react";
import { ThemeSwitcher } from "../theme-switcher/ThemeSwitcher";
import { useSession } from "next-auth/react";
import UserDropDown from "./UserDropDown";

const App = () => {
  const { data: session, status } = useSession();

  return (
    <Navbar>
      <NavbarContent>
        <NavbarBrand className="flex gap-1">
          <Link className="text-inherit flex gap-1" href="/">
            <Slack size={30} />
            <p className="font-bold text-inherit text-xl">PurePick</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
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
    </Navbar >
  );
}

export default App;