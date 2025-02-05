import { auth, signIn, signOut } from '@/auth'
// signIn and signOut are async functions that are used to sign in and sign out the user
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

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
                                <span>Create</span>
                            </Link>

                            {/* <button onClick={async () => {
                                'use server';
                                await signOut();
                            }}>
                                <span>Logout</span>
                            </button> */}

                            <form action={async () => {
                                'use server';
                                await signOut({redirectTo: '/'});
                            }}>
                                <button type='submit'>
                                    Logout
                                </button>
                            </form>

                            <Link href={`/user/${session?.user?.id}`}>
                                <span>{session?.user?.name}</span>
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
                                    Login
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