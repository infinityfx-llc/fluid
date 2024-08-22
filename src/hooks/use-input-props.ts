import { useMemo } from "react";

const InputProps = {
    name: 0,
    type: 1,
    checked: 2,
    defaultChecked: 3,
    value: 4,
    defaultValue: 5,
    disabled: 6,
    required: 7,
    placeholder: 8,
    readOnly: 9,
    onChange: 10,
    onFocus: 11,
    onBlur: 12,
    step: 13,
    min: 14,
    minLength: 15,
    max: 16,
    maxLength: 17,
    pattern: 18,
    accept: 19,
    autoComplete: 20,
    autoFocus: 21,
    multiple: 22,
    enterKeyHint: 23,
    inputMode: 24,
    'aria-label': 25,
    'aria-labelledby': 26
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