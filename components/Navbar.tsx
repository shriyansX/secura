"use client"
import React from 'react'
import { Moon, Sun, Shield, Key, CreditCard, Settings, Mail } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { SignInButton } from '@clerk/nextjs'
import { SignedIn, SignedOut, SignUpButton, UserButton } from '@clerk/clerk-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Navbar = () => {
    const { theme, setTheme } = useTheme()
    const pathname = usePathname()
    const [mounted, setMounted] = React.useState(false)
    
    React.useEffect(() => {
        setMounted(true)
    }, [])
    
    const toggleTheme = () => {
        if (theme=="dark"){
            setTheme("light")
        } else {
            setTheme("dark")
        }
    }
    
    return (
        <nav className='sticky top-0 z-50 flex justify-between items-center px-4 h-16 bg-background/80 backdrop-blur-sm border-b'>
            <Link href="/" className='font-bold text-xl flex items-center gap-2'>
                <Shield className="h-5 w-5 text-primary" />
                Secura
            </Link>
            
            <SignedIn>
                <ul className='hidden md:flex gap-5 justify-start items-center'>
                    <li>
                        <Link 
                            href="/dashboard" 
                            className={`hover:text-primary transition-colors ${pathname === '/dashboard' ? 'text-primary font-medium' : ''}`}
                        >
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/passwords" 
                            className={`hover:text-primary transition-colors ${pathname === '/passwords' ? 'text-primary font-medium' : ''}`}
                        >
                            Passwords
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/cards" 
                            className={`hover:text-primary transition-colors ${pathname === '/cards' ? 'text-primary font-medium' : ''}`}
                        >
                            Cards
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/settings" 
                            className={`hover:text-primary transition-colors ${pathname === '/settings' ? 'text-primary font-medium' : ''}`}
                        >
                            Settings
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/contact" 
                            className={`hover:text-primary transition-colors ${pathname === '/contact' ? 'text-primary font-medium' : ''}`}
                        >
                            Contact
                        </Link>
                    </li>
                </ul>
            </SignedIn>
            
            <div className='flex gap-2 justify-center items-center'>
                {mounted && (
                    <Button variant="outline" size="icon" onClick={toggleTheme}>
                        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                )}
                
                <SignedOut>
                    <Link href="/contact">
                        <Button variant="ghost" size="sm">Contact</Button>
                    </Link>
                    <SignInButton mode="modal">
                        <Button variant="outline" size="sm">Sign In</Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                        <Button size="sm">Sign Up</Button>
                    </SignUpButton>
                </SignedOut>
                
                <SignedIn>
                    <div className="md:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
                                        <line x1="4" x2="20" y1="12" y2="12"/>
                                        <line x1="4" x2="20" y1="6" y2="6"/>
                                        <line x1="4" x2="20" y1="18" y2="18"/>
                                    </svg>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                                        <Shield className="h-4 w-4" />
                                        Dashboard
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/passwords" className="flex items-center gap-2 cursor-pointer">
                                        <Key className="h-4 w-4" />
                                        Passwords
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/cards" className="flex items-center gap-2 cursor-pointer">
                                        <CreditCard className="h-4 w-4" />
                                        Cards
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                                        <Settings className="h-4 w-4" />
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/contact" className="flex items-center gap-2 cursor-pointer">
                                        <Mail className="h-4 w-4" />
                                        Contact
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <UserButton afterSignOutUrl="/" />
                </SignedIn>
            </div>
        </nav>
    )
}

export default Navbar
