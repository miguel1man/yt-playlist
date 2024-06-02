import React, { FC, ChangeEvent } from "react";
import { customInputProps } from "../business/types";

const CustomInput: FC<customInputProps> = ({
  title,
  inputValue,
  onChangeHandler,
}) => {
  return (
    <section className="flex flex-col gap-2">
      <p className="mb-0">{title}</p>
      <input
        className="text-black w-full p-2 rounded-md"
        placeholder="Example: https://www.youtube.com/playlist?list=PL6..."
        value={inputValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChangeHandler(e.target.value)
        }
      />
    </section>
  );
};

export default CustomInput;
