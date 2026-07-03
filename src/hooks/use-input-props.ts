import { useMemo } from "react";

const InputProps = {
    name: 0,
    type: 1,
    capture: 2,
    checked: 3,
    defaultChecked: 4,
    value: 5,
    defaultValue: 6,
    disabled: 7,
    required: 8,
    placeholder: 9,
    readOnly: 10,
    onChange: 11,
    onFocus: 12,
    onBlur: 13,
    step: 14,
    min: 15,
    minLength: 16,
    max: 17,
    maxLength: 18,
    pattern: 19,
    accept: 20,
    autoComplete: 21,
    autoFocus: 22,
    multiple: 23,
    enterKeyHint: 24,
    inputMode: 25,
    'aria-label': 26,
    'aria-labelledby': 27
};

export default function useInputProps<T = any>(props: React.InputHTMLAttributes<T>): [Pick<React.InputHTMLAttributes<T>, keyof typeof InputProps>, React.HTMLAttributes<any>] {
    return useMemo(() => {
        const split: Pick<React.InputHTMLAttributes<T>, keyof typeof InputProps> = {};
        const rest: React.HTMLAttributes<any> = {};

        for (const prop in props) {
            if (prop in InputProps) {
                // @ts-ignore
                split[prop as keyof typeof InputProps] = props[prop as keyof React.HTMLAttributes<any>];
            } else {
                rest[prop as keyof React.HTMLAttributes<any>] = props[prop as keyof React.HTMLAttributes<any>];
            }
        }

        return [split, rest];
    }, [props]);
}