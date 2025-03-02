import { auth } from '@/auth';
import StartupForm from '@/components/StartupForm';
import { client } from '@/sanity/lib/client';
import { STARTUP_BY_ID_QUERY } from '@/sanity/lib/queries';
import { notFound, redirect } from 'next/navigation';
import React from 'react'

const EditPage = async ({ params }: { params: Promise<{ id: string }> }) => {

  const { id } = await params;

  const session = await auth();

  if (!session) redirect('/');

  const post = await client.fetch(STARTUP_BY_ID_QUERY, { id });

  if (!post) {
    return notFound();
  }

  if (session?.id != post.author._id) redirect('/');

  return (
    <>
      <section className='pink_container !min-h-[230px]'>
        <h1 className='heading'>Editing Your Startup</h1>
      </section>
      <StartupForm post={post} />
    </>
  )
}

export default EditPage