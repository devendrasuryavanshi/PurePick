'use client';
import React from 'react';
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from 'lucide-react';
import { CHIP_COLORS } from '@/data/constants';
import { cn } from '@/lib/utils';
import { Chip } from '@nextui-org/react';
import { ConditionSelectorProps } from '@/types/profile.types';

export const ConditionSelector = ({
    title,
    items,
    selectedItems,
    isOpen,
    setIsOpen,
    onItemSelect,
    onItemRemove,
    isEditing,
    searchPlaceholder = "Search...",
    emptyMessage = "No item found."
}: ConditionSelectorProps) => {
    return (
        <div className="space-y-4 flex flex-col">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isOpen}
                        className="justify-between text-black dark:text-white self-end dark:bg-transparent hover:dark:bg-transparent"
                        disabled={!isEditing}
                    >
                        {title}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-default-100 dark:bg-default-50 border-default-200">
                    <Command className="bg-default-100 dark:bg-default-50">
                        <CommandInput placeholder={searchPlaceholder} className="bg-transparent" />
                        <CommandList className="bg-default-100 dark:bg-default-50">
                            <CommandEmpty className="text-default-500">{emptyMessage}</CommandEmpty>
                            <CommandGroup className="bg-default-100 dark:bg-default-50">
                                {items.map((item) => (
                                    <CommandItem
                                        key={item}
                                        value={item}
                                        className="data-[selected=true]:bg-default-200 dark:data-[selected=true]:bg-default-100 hover:bg-default-200 dark:hover:bg-default-100 cursor-pointer"
                                        onSelect={onItemSelect}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selectedItems.includes(item) ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {item}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            <div className="h-24 overflow-y-auto custom-scrollbar p-2 border-l-2 border-primary pl-6">
                <div className="flex flex-wrap gap-2">
                    {selectedItems.map((item, index) => (
                        <Chip
                            size="sm"
                            key={index}
                            onClose={isEditing ? () => onItemRemove(index) : undefined}
                            variant="flat"
                            color={CHIP_COLORS[index % CHIP_COLORS.length]}
                            classNames={{
                                base: "py-1 px-2",
                                content: "text-sm font-medium"
                            }}
                        >
                            {item}
                        </Chip>
                    ))}
                </div>
            </div>
        </div>
    );
};
