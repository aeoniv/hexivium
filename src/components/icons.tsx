
import type { SVGProps } from "react";

export const Icons = {
  YinYang: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g stroke="currentColor" strokeWidth="2">
        <circle cx="50" cy="50" r="49" fill="transparent"/>
        <path d="M50,1 A49,49 0 0,0 50,99 A24.5,24.5 0 0,0 50,50 A24.5,24.5 0 0,1 50,1 Z" fill="currentColor"/>
        <circle cx="50" cy="25.5" r="7" fill="var(--yin-yang-bg, white)"/>
        <circle cx="50" cy="74.5" r="7" fill="currentColor"/>
      </g>
    </svg>
  ),
};
