export interface customInputProps {
  title: string;
  inputValue: string;
  onChangeHandler: (value: string) => void;
  placeholder: string;
}

export interface CustomTextareaProps {
  onChangeHandler: (value: string) => void;
  placeholder: string;
  textareaValue: string;
}
