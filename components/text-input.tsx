import type { ComponentProps, FC, ReactElement } from "react";
import clsx from "clsx";
import { FaSearch } from "react-icons/fa";

export const TextInput: FC<{
    icon: ReactElement;
    value: string;
    onChange: (newValue: string) => void;
}> = ({ value, onChange, ...props }) => {
    return (
        <span className={clsx("relative")}>
            <input
                {...props}
                type="text"
                className={clsx(
                    "pl-10 pr-4 py-2 w-96",
                    "rounded-full",
                    "bg-white dark:bg-gray-800",
                    "border border-gray-200 dark:border-gray-700"
                )}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <FaSearch
                className={clsx("absolute left-4 top-1/2 -translate-y-1/2")}
            />
        </span>
    );
};
