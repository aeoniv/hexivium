
import type { SVGProps } from "react";

export default function KungFuIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M12 2a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1z" />
            <path d="M4.929 4.929a1 1 0 0 1 1.414 0L9 7.586A3 3 0 0 1 9 12h6a3 3 0 0 1 0 6H9a3 3 0 0 1-2.121-.879L3.515 13.757a1 1 0 0 1 1.414-1.414L7.586 15H9a1 1 0 1 0 0-2H7.586l-2.657-2.657a1 1 0 0 1 0-1.414z" />
            <path d="M15 12h- simptomy" />
            <circle cx="18" cy="6" r="2" />
        </svg>
    );
}
