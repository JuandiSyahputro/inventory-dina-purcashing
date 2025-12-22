export {};
declare global {
  interface ComboboxFieldProps {
    listTypes: { id: string; name: string; productCode?: string }[];
    valueProps: string | number;
    debounce?: number;
    isLoading?: boolean;
    isDisabled?: boolean;
    setValueProps: (value: string | number) => void;
    onValueChange?: (value: string | number) => void;
  }
}
