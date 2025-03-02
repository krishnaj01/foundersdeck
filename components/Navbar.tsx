import { auth, signIn, signOut } from '@/auth'
import { BadgePlus, LogOut } from 'lucide-react'
// signIn and signOut are async functions that are used to sign in and sign out the user
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const Navbar = async () => {
    const session = await auth();

    return (
        <header className='px-5 py-3 bg-white shadow-sm font-work-sans'>
            <nav className='flex justify-between items-center'>
                <Link href='/'>
                    <Image src='/logo.svg' alt='logo' width={250} height={40} />
                </Link>

                <div className='flex items-center gap-5 text-black'>
                    {session && session?.user ? (
                        <>
                            <Link href='/startup/create'>
                                <span className='max-sm:hidden hover:text-red-800 hover:underline'>Create Pitch</span>
                                <BadgePlus className='size-6 sm:hidden hover:scale-110' />
                            </Link>

                            {/* <button onClick={async () => {
                                'use server';
                                await signOut();
                            }}>
                                <span>Logout</span>
                            </button> */}

                            <form action={async () => {
                                'use server';
                                await signOut({ redirectTo: '/' });
                            }}>
                                <button type='submit'>
                                    <span className='max-sm:hidden hover:text-red-800 hover:underline'>Logout</span>
                                    <LogOut className='size-6 sm:hidden text-red-500 hover:scale-110' />
                                </button>
                            </form>

                            <Link href={`/user/${session?.id}`}>
                                <Avatar className='size-10 border-2 border-transparent hover:border-slate-950 hover:scale-105'>
                                    <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
                                    <AvatarFallback>AV</AvatarFallback>
                                </Avatar>
                            </Link>
                        </>
                    ) : (
                        <>
                            {/* <button onClick={async() => {
                                'use server';
                                await signIn('github');
                            }}>
                                <span>Login</span>
                            </button> */}
                            <form action={async () => {
                                'use server';
                                await signIn('github');
                            }}>
                                <button type='submit'>
                                    <span className='hover:text-red-800 hover:underline'>Login</span>
                                </button>
                            </form>
                        </>
                    )}
                </div>

            </nav>
        </header >
    )
}

export default Navbar