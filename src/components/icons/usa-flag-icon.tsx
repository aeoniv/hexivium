import type { SVGProps } from "react";

export default function UsaFlagIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6" {...props}>
            <rect width="9" height="6" fill="#B22234"/>
            <path d="M0 1H9 M0 2H9 M0 3H9" stroke="#fff" strokeWidth="1"/>
            <rect width="4" height="3" fill="#3C3B6E"/>
        </svg>
    );
}
