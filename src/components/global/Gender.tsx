import { genderOptions } from "@/data/constants";
import { Select, SelectItem } from "@nextui-org/react";

const GenderInput = ({ handleInputChange }: { handleInputChange: (e: any) => void }) => {
  return (
    <Select 
      id="gender"
      size="sm" 
      radius="sm" 
      variant="flat" 
      className="max-w-xs flex flex-col justify-center pt-[23px]" 
      classNames={{
        base: "min-h-[40px]",
        trigger: "min-h-[26px] py-0.5",
        value: "text-tiny",
        innerWrapper: "text-tiny",
        mainWrapper: "h-[42px]",
        label: "text-tiny",
        listbox: "text-tiny",
        listboxWrapper: "max-h-[200px]"
      }}
      label="Select Gender"
      onChange={(e) => handleInputChange({ target: { id: 'gender', value: e.target.value } })}
    >
      {genderOptions.map((gender) => (
        <SelectItem key={gender.id} value={gender.id} className="text-tiny h-[26px] text-default-foreground">
          {gender.label}
        </SelectItem>
      ))}
    </Select>
  );
}

export default GenderInput;
