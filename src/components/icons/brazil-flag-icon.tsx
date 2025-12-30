import type { SVGProps } from "react";

export default function BrazilFlagIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6" {...props}>
            <rect width="9" height="6" fill="#009B3A"/>
            <path d="M4.5 1L1 3L4.5 5L8 3L4.5 1Z" fill="#FFCC29"/>
            <circle cx="4.5" cy="3" r="1" fill="#002776"/>
        </svg>
    );
}
