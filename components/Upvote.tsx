'use client'
import { toast } from '@/hooks/use-toast';
import { vote } from '@/lib/actions';
import { Heart } from 'lucide-react';
import React, { useState } from 'react'

const Upvote = ({ startupId, userId, upvotes }: { startupId: string, userId: string, upvotes: string[] }) => {

    const [hasVoted, setHasVoted] = useState(upvotes?.includes(userId));

    const handleUpvote = async (prevState: any) => {
        const response = await vote(prevState, startupId, upvotes);

        if (response.status === 'SUCCESS') {
            toast({
                title: 'Success',
                description: 'Your vote has been recorded, refresh the page to see the changes',
            });
            setHasVoted(!hasVoted);
        }
    }

    return (
        <div className='cursor-pointer hover:scale-110' onClick={handleUpvote}>
            {hasVoted ? <Heart fill='#EE2B69' /> : <Heart />}
        </div>
    )
}

export default Upvote