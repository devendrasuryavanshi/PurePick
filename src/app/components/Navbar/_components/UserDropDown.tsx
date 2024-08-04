import React from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, User, Tooltip } from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";

export default function App() {
    const { data: session } = useSession();
    console.log(session);
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
                        <Tooltip content={session?.user.email} offset={15}>
                            <div>
                                <p className="font-semibold">Signed in as</p>
                                <p className="font-semibold w-36 truncate">{session?.user.email}</p>
                            </div>
                        </Tooltip>
                    </DropdownItem>
                    <DropdownItem key="settings">
                        {session?.user.firstName}
                    </DropdownItem>
                    <DropdownItem key="team_settings">Team Settings</DropdownItem>
                    <DropdownItem key="analytics">
                        Analytics
                    </DropdownItem>
                    <DropdownItem key="system">System</DropdownItem>
                    <DropdownItem key="configurations">Configurations</DropdownItem>
                    <DropdownItem key="help_and_feedback">
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