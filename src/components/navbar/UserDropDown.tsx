import React from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, User, Tooltip } from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";

const App = () => {
    const { data: session } = useSession();
    return (
        <div className="flex items-center gap-4">
            <Dropdown placement="bottom-end">
                <DropdownTrigger>
                    <Avatar
                        as="button"
                        className="transition-transform"
                        showFallback
                        src={session?.user.image || ""}
                    />
                </DropdownTrigger>
                <DropdownMenu className="text-black dark:text-gray-300" aria-label="Profile Actions" variant="flat">
                    <DropdownItem key="profile" className="h-14 gap-2">
                        <div>
                            <p className="font-semibold">Signed in as</p>
                            <p className="font-semibold w-36 truncate">{session?.user.email}</p>
                        </div>
                    </DropdownItem>
                    <DropdownItem key="profile" href="/profile">
                        Profile
                    </DropdownItem>
                    <DropdownItem key="History" href="/product-history">
                        History
                    </DropdownItem>
                    <DropdownItem key="Admin" href="/admin/dashboard">
                        Dashboard
                    </DropdownItem>
                    <DropdownItem href="/feedback" key="help_and_feedback">
                        Help & Feedback
                    </DropdownItem>
                    <DropdownItem key="logout" color="danger" onClick={() => signOut()}>
                        Log Out
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
}

export default App;