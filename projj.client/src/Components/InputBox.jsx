import { Input } from "@nextui-org/react";

export default function InputBox({
  checked,
  inputLabel,
  placeholderData,
  inputType,
  handleChange,
  name,
}) {
  return (
    // If input type is checkbox, use checked instead of placeholder to handle
    // the default state of the checkbox based on whether task.isCompleted is true or not.
    <div>
      {inputType === "checkbox" ? (
        <Input
        label={inputLabel}
        checked={checked}
        type={inputType}
        name={name}
        onChange={handleChange}
        isClearable={true}
        color="default"
        className={checked && "placeholder:bg-red-900"}
        />
      ) : (
        <Input
          label={inputLabel}
          placeholder={placeholderData}
          type={inputType}
          name={name}
          onChange={handleChange}
          isClearable={true}
          className="w-full"
        />
      )}
    </div>
  );
}