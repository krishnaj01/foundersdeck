import { client } from '@/sanity/lib/client'
import { STARTUP_UPVOTES_QUERY } from '@/sanity/lib/queries'
import { VoteIcon } from 'lucide-react'
import React from 'react'
import Upvote from './Upvote'

const Votes = async ({ startupId, userId }: { startupId: string, userId?: string }) => {
  const { upvotes } = await client.withConfig({ useCdn: false }).fetch(STARTUP_UPVOTES_QUERY, { id: startupId })
  const totalVotes = Array.isArray(upvotes) ? upvotes.length : 0;

  return (
    <>
      <div className='flex items-center gap-2'>
        <VoteIcon size={30} className='text-green-600'/>
        <p className='font-semibold text-2xl'>{totalVotes}</p>
        {userId && <Upvote startupId={startupId} userId={userId} upvotes={upvotes}/>}
      </div>
    </>
  )
}

export default Votes