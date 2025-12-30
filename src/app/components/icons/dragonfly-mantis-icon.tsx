import type { SVGProps } from "react";

export default function DragonflyMantisIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
            {...props}
        >
            <defs>
                <clipPath id="clip-yin">
                    <path d="M 100 0 A 100 100 0 0 0 100 200 Z" />
                </clipPath>
                <clipPath id="clip-yang">
                    <path d="M 100 0 A 100 100 0 0 1 100 200 Z" />
                </clipPath>
            </defs>

            {/* Yin - Black side with Dragonfly */}
            <g>
                <path d="M 100 0 A 100 100 0 0 0 100 200 A 50 50 0 0 1 100 100 A 50 50 0 0 0 100 0 Z" fill="black" />
                <circle cx="100" cy="50" r="15" fill="white" />
                
                {/* Dragonfly in Yin */}
                <g transform="translate(85, 125) rotate(-30) scale(0.4)">
                    <path d="M35.4,46.1c0,0-1.2-11.3,7.9-15.6s12.5,0,12.5,0s-1-11.3-14.8-11.3s-14.8,11.3-14.8,11.3s4.6,0,12.5,0S35.4,46.1,35.4,46.1z" fill="white"/>
                    <path d="M43.3,30.5c0,0,11.3-1.2,15.6,7.9s0,12.5,0,12.5s11.3-1,11.3-14.8S54.6,19.8,54.6,19.8s0,4.6,0,12.5S43.3,30.5,43.3,30.5z" fill="white" />
                    <ellipse cx="29.8" cy="18.5" rx="3" ry="5" fill="white"/>
                </g>
            </g>

            {/* Yang - White side with Mantis */}
            <g>
                <path d="M 100 0 A 100 100 0 0 1 100 200 A 50 50 0 0 0 100 100 A 50 50 0 0 1 100 0 Z" fill="white" stroke="black" strokeWidth="2"/>
                <circle cx="100" cy="150" r="15" fill="black" />

                {/* Mantis in Yang */}
                <g transform="translate(100, 50) rotate(30) scale(0.4)">
                    <path d="M54.7,28.8c1.6-1.5,3.2-3,4.6-4.6c1.3-1.5,2.7-3,4.6-4.2c2.4-1.5,4.2-2,5.2-2.2c-0.1,0-0.1,0.1-0.2,0.1c-2.4,1.4-4.8,3-7,4.8c-2,1.6-3.8,3.3-5.5,5.2c-1.6,1.8-3.2,3.7-4.6,5.7c-0.1-0.1-0.2-0.2-0.3-0.3c2.4-2.6,4.8-5.2,7.2-7.7" fill="none" stroke="black" strokeWidth="3"/>
                    <path d="M68.7,17.9c1.6,0,3.2-0.1,4.8-0.3c1.6-0.2,3.2-0.5,4.7-1c0.1,0.2,0.2,0.3,0.3,0.5c-2.1,0.7-4.3,1.1-6.5,1.3c-2.2,0.2-4.5,0.2-6.7,0.1" fill="none" stroke="black" strokeWidth="3"/>
                    <path d="M58.3,27.3c0,0-1.6,3.4-1.6,7.3c0,3.9,0,7.3-0.5,9.4" fill="none" stroke="black" strokeWidth="3"/>
                    <path d="M60.2,43.9c-2,2.4-4,4.9-6,7.3c-2.1,2.5-4.3,5-6.4,7.4" fill="none" stroke="black" strokeWidth="3"/>
                    <path d="M51.2,47.1c-3.6,1.2-7.2,2.5-10.7,3.9c-3.5,1.4-6.9,3-10.2,4.8" fill="none" stroke="black" strokeWidth="3"/>
                    <circle cx="69.7" cy="17.9" r="2.5" fill="black"/>
                </g>
            </g>
            <circle cx="100" cy="100" r="99" fill="none" stroke="black" strokeWidth="2" />
        </svg>
    );
}
