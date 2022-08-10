import React from 'react';
import Link from 'next/link';
const Header = props=>{
    return <>
    <nav>
        <Link href="/">
            <a>Home</a>
        </Link>
    </nav>
    <div>
        {props.children}
    </div>
   
    </>;
}
export default Header;