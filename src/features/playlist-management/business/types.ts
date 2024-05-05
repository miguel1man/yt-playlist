import { MouseEvent } from "react";

export interface customInputProps {
  title: string;
  inputValue: string;
  onChangeHandler: (value: string) => void;
}

export interface CustomTextareaProps {
  onChangeHandler: (value: string) => void;
  placeholder: string;
  textareaValue: string;
}

export interface CustomButtonProps {
  buttonText: string;
  isLoading: boolean;
  onClickHandler: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface CreatePlaylistData {
  auth: any;
  newItems: string;
  customPlaylistId?: string;
}
