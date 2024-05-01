import { FC } from "react";
import { CustomButtonProps } from "../business/types";

const CustomButton: FC<CustomButtonProps> = ({
  buttonText,
  isLoading,
  onClickHandler,
}) => {
  return (
    <button
      className={`p-2 rounded-md ${isLoading ? "bg-red-700" : "bg-red-600"} hover:bg-red-700`}
      onClick={onClickHandler}
      disabled={isLoading}
    >
      {buttonText}
    </button>
  );
};

export default CustomButton;
