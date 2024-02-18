import React, { FC, MouseEvent } from "react";

interface CustomButtonsProps {
  buttonText: string;
  onClickHandler: (event: MouseEvent<HTMLButtonElement>) => void;
}

const CustomButtons: FC<CustomButtonsProps> = ({
  buttonText,
  onClickHandler,
}) => {
  return (
    <button
      className="bg-red-600 hover:bg-red-700 p-2 rounded-md"
      onClick={onClickHandler}
    >
      {buttonText}
    </button>
  );
};

export default CustomButtons;
