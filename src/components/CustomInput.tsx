import React, { FC, ChangeEvent } from "react";

interface customInputProps {
  inputValue: string;
  onChangeHandler: (value: string) => void;
  placeholder: string;
}

const CustomInput: FC<customInputProps> = ({
  inputValue,
  onChangeHandler,
  placeholder,
}) => {
  return (
    <input
      className="text-black w-full p-2 rounded-md mb-4"
      placeholder={placeholder}
      value={inputValue}
      onChange={(e: ChangeEvent<HTMLInputElement>) =>
        onChangeHandler(e.target.value)
      }
    />
  );
};

export default CustomInput;
