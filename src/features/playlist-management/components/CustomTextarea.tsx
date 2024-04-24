import React, { FC, ChangeEvent } from "react";
import { CustomTextareaProps } from "../business/types";

const CustomTextarea: FC<CustomTextareaProps> = ({
  onChangeHandler,
  placeholder,
  textareaValue,
}) => {
  return (
    <textarea
      className="text-black w-full p-2 rounded-md"
      placeholder={placeholder}
      value={textareaValue}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
        onChangeHandler(e.target.value)
      }
    />
  );
};

export default CustomTextarea;
