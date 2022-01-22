import type { FC } from "react";
import Link from "next/link";
import clsx from "clsx";

export const PaginationNav: FC<{
    page: number;
    name: string;
    canGoPrev: boolean;
    canGoNext: boolean;
}> = ({ page, name, canGoPrev, canGoNext }) => {
    return (
        <nav className={clsx("flex justify-center", "my-2")}>
            {canGoPrev && (
                <Link href={`/player/${name}?page=${page - 1}`}>
                    <a className={clsx("px-8 py-4", "font-bold text-blue-500")}>
                        Previous
                    </a>
                </Link>
            )}
            {canGoNext && (
                <Link href={`/player/${name}?page=${page + 1}`}>
                    <a className={clsx("px-8 py-4", "font-bold text-blue-500")}>
                        Next
                    </a>
                </Link>
            )}
        </nav>
    );
};
