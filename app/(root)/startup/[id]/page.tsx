import { formatDate } from '@/lib/utils';
import { client } from '@/sanity/lib/client';
import { PLAYLIST_BY_SLUG_QUERY, STARTUP_BY_ID_QUERY } from '@/sanity/lib/queries';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import markdownit from 'markdown-it'
import React, { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton';
import View from '@/components/View';
import StartupCard, { StartupCardType } from '@/components/StartupCard';
import { auth } from '@/auth';
import Votes from '@/components/Votes';

// export const experimental_ppr = true;


const md = markdownit()

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const session = await auth();

    // to make parallel requests (parallel rendering is faster)
    const [post, { select: editorPosts }] = await Promise.all([
        client.fetch(STARTUP_BY_ID_QUERY, { id }),
        client.fetch(PLAYLIST_BY_SLUG_QUERY, {
            slug: "editor-picks",
        }),
    ]);

    // this is sequential requests
    // const post = await client.fetch(STARTUP_BY_ID_QUERY, { id });
    // const { select: editorPosts } = await client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: 'editor-picks' })

    const parsedContent = md.render(post?.pitch || '');

    if (!post) {
        return notFound();
    }

    return (
        <>
            <section className='pink_container !min-h-[230px]'>
                <p className='tag'>{formatDate(post?._createdAt)}</p>
                <h1 className='heading'>{post.title}</h1>
                <p className='sub-heading !max-w-5xl'>{post.description}</p>
            </section>

            <section className='section_container'>
                <img src={post.image} alt="thumbnail" className='w-full h-auto rounded-xl' />

                <div className='space-y-5 mt-10 max-w-4xl mx-auto'>
                    <div className='flex-between gap-5'>
                        <Link href={`/user/${post.author?._id}`} className='flex gap-2 items-center mb-3'>
                            <Image src={post.author?.image} alt="avatar" width={64} height={64} className='rounded-full drop-shadow-lg' />
                            <div>
                                <p className='text-20-medium'>{post.author.name}</p>
                                <p className='text-16-medium !text-black-300'>@{post.author.username}</p>
                            </div>
                        </Link>
                        <p className='category-tag'>{post.category}</p>

                        {session && session?.id === post.author?._id && <Link href={`/startup/edit/${post?._id}`} className='hover:text-blue-500 hover:underline'>Edit Startup Details</Link>}
                    </div>

                    <div className='flex justify-between items-center'>
                        <h3 className='text-30-bold'>Pitch Details</h3>
                        {/* <p>Upvote</p> */}
                        <Suspense fallback={<p>Loading...</p>}>
                            <Votes startupId={post._id} userId={session?.id}/>
                        </Suspense>
                    </div>
                    {parsedContent ? (
                        <article
                            className='prose max-w-4xl font-work-sans break-all'
                            dangerouslySetInnerHTML={{ __html: parsedContent }}
                        />
                    ) : (
                        <p className='no-result'>No Details Provided</p>
                    )}
                </div>

                <hr className='divider' />

                {editorPosts?.length > 0 && (
                    <div className='max-w-4xl mx-auto'>
                        <p className='text-30-semibold'>Editor Picks</p>

                        <ul className='mt-7 card_grid-sm'>
                            {editorPosts.map((post: StartupCardType, i: number) => (
                                <li className='startup-card group' key={i} >
                                    <StartupCard post={post} />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <Suspense fallback={<Skeleton className='view_skeleton' />}>
                    <View id={id} />
                </Suspense>

            </section>
        </>
    )
}

export default Page