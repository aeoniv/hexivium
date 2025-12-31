import type { SVGProps } from "react";

export default function MedicineIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
            <path d="M12 18C14.129 17.9936 15.9936 16.129 16 14C16.0064 11.871 14.129 10.0064 12 10C9.87103 10.0064 8.00643 11.871 8 14C8.00643 16.129 9.87103 17.9936 12 18Z" />
            <path d="M12 10C12 4 18 8 12 10Z" />
            <path d="M12 10C12 4 6 8 12 10Z" />
        </svg>
    );
}
