import React, { FC, ChangeEvent } from "react";

interface CustomTextareaProps {
  onChangeHandler: (value: string) => void;
  placeholder: string;
  textareaValue: string;
}

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
