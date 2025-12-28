import * as React from "react"

const Logo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
        <circle cx="50" cy="15" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
        <circle cx="50" cy="85" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
        <circle cx="15" cy="50" r="10" fill="currentColor"/>
        <circle cx="85" cy="50" r="10" fill="currentColor"/>
        <circle cx="30" cy="30" r="10" fill="currentColor"/>
        <circle cx="70" cy="30" r="10" fill="currentColor"/>
        <circle cx="30" cy="70" r="10" fill="currentColor"/>
        <circle cx="70" cy="70" r="10" fill="currentColor"/>
    </svg>
)

export default Logo
