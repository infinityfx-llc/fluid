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
    step: 11,
    min: 12,
    minLength: 13,
    max: 14,
    maxLength: 15,
    pattern: 16,
    accept: 17,
    autoComplete: 18,
    multiple: 19,
    enterKeyHint: 20,
    inputMode: 21
};

export default function useInputProps<T = any>(props: React.InputHTMLAttributes<T>): [Pick<React.InputHTMLAttributes<T>, keyof typeof InputProps>, React.HTMLAttributes<any>] {
    return useMemo(() => {
        const split: Pick<React.InputHTMLAttributes<T>, keyof typeof InputProps> = {};
        const rest: React.HTMLAttributes<any> = {};

        for (const prop in props) {
            if (prop in InputProps) {
                split[prop as keyof typeof InputProps] = props[prop as keyof React.HTMLAttributes<any>];
            } else {
                rest[prop as keyof React.HTMLAttributes<any>] = props[prop as keyof React.HTMLAttributes<any>];
            }
        }

        return [split, rest];
    }, [props]);
}