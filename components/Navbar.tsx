"use client"
import React from 'react'
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { SignInButton } from '@clerk/nextjs'
import { SignedIn, SignedOut, SignUpButton, UserButton } from '@clerk/clerk-react'


const Navbar = () => {
    const { theme,setTheme } = useTheme()
    const toggleTheme = () => {
        if (theme=="dark"){
            setTheme("light")
        } else {
            setTheme("dark")
        }
    }
    return (
        <nav className='flex justify-between items-center px-4 h-16 bg-primary/20 text-foreground'>
            <span className='font-bold text-xl'>Secura</span>
            <ul className='flex gap-5 justify-start items-center'>
                <li>Home</li>
                <li>About</li>
                <li>Services</li>
                <li>Contact</li>
            </ul>
            <div className='flex gap-2 justify-center items-center'>

                        <Button variant="outline" size="icon" onClick={toggleTheme}>
                            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    
                <SignedOut>
                    <SignInButton />
                    <SignUpButton>
                        <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                            Sign Up
                        </button>
                    </SignUpButton>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </nav>
    )
}

export default Navbar
