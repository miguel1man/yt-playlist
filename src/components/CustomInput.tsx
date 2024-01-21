import React, { FC, ChangeEvent } from "react";
import { customInputProps } from "../models/types";

const CustomInput: FC<customInputProps> = ({
  title,
  inputValue,
  onChangeHandler,
  placeholder,
}) => {
  return (
    <>
      <p>{title}</p>
      <input
        className="text-black w-full p-2 rounded-md mb-4"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChangeHandler(e.target.value)
        }
      />
    </>
  );
};

export default CustomInput;
