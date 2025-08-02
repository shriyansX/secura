import React from 'react'

const Navbar = () => {
    return (
        <nav className='flex justify-between items-center px-4 h-16 bg-border text-background'>
            <span>Secura</span>
            <ul className='flex gap-5 justify-start items-center'>
                <li>Home</li>
                <li>About</li>
                <li>Services</li>
                <li>Contact</li>
            </ul>
        </nav>
    )
}

export default Navbar
