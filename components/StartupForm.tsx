"use client"
import React, { useActionState, useState } from 'react'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea';
import MDEditor from '@uiw/react-md-editor';
import { Button } from './ui/button';
import { Send } from 'lucide-react';
import { formSchema } from '@/lib/validation';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createPitch, updatePitch } from '@/lib/actions';
import { StartupCardType } from './StartupCard';

const StartupForm = ({ post }: { post?: StartupCardType }) => {

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [pitch, setPitch] = useState(post?.pitch || '');
    const { toast } = useToast();
    const router = useRouter();
    const [values, setValues] = useState({
        title: post?.title || '',
        description: post?.description || '',
        category: post?.category || '',
        image: post?.image || '',
    });


    const handleFormSubmit = async (prevState: any, formData: FormData) => {
        try {
            const formValues = {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                category: formData.get('category') as string,
                image: formData.get('image') as string,
                pitch,
            }

            await formSchema.parseAsync(formValues);

            let result;

            if (post) {
                result = await updatePitch(prevState, formData, pitch, post);
            } else {
                result = await createPitch(prevState, formData, pitch);
            }


            if (result.status === 'SUCCESS') {
                toast({
                    title: 'Success',
                    description: post ? 'Your idea has been edited successfully, it will be reflected soon' : 'Your idea has been submitted successfully',
                });
                router.push(`/startup/${result._id}`);
            }

            return result;

        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors = error.flatten().fieldErrors;
                setErrors(fieldErrors as unknown as Record<string, string>);

                toast({
                    title: 'Error',
                    description: 'Please check your inputs and try again',
                    variant: 'destructive'
                })

                return { ...prevState, error: 'Validation Failed', status: 'ERROR' };
            }

            toast({
                title: 'Error',
                description: 'An unexpected error has occurred',
                variant: 'destructive'
            })

            return { ...prevState, error: 'An unexpected error has occurred', status: 'ERROR' };
        }
    }

    const [state, formAction, isPending] = useActionState(handleFormSubmit, { error: '', status: 'INITIAL' });

    const handleValueChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const changedField = evt.target.name;
        const newValue = evt.target.value;
        setValues((currValues) => ({ ...currValues, [changedField]: newValue }));
    }

    const handleDescriptionChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
        const changedField = evt.target.name;
        const newValue = evt.target.value;
        setValues((currValues) => ({ ...currValues, [changedField]: newValue }));
    }


    return (
        <form action={formAction} className='startup-form'>
            <div>
                <label htmlFor="title" className='startup-form_label'>Title</label>
                <Input id='title' name='title' value={values.title} onChange={handleValueChange} required placeholder='Startup Title' className='startup-form_input' />
                {errors.title && <p className='startup-form_error'>{errors.title}</p>}
            </div>

            <div>
                <label htmlFor="description" className='startup-form_label'>Description</label>
                <Textarea id='description' name='description' value={values.description} onChange={handleDescriptionChange} required placeholder='Startup Description' className='startup-form_textarea' />
                {errors.description && <p className='startup-form_error'>{errors.description}</p>}
            </div>

            <div>
                <label htmlFor="category" className='startup-form_label'>Category</label>
                <Input id='category' name='category' value={values.category} onChange={handleValueChange} required placeholder='Startup Category (Tech, Health, Education...)' className='startup-form_input' />
                {errors.category && <p className='startup-form_error'>{errors.category}</p>}
            </div>

            <div>
                <label htmlFor="image" className='startup-form_label'>Image URL</label>
                <Input id='image' name='image' value={values.image} onChange={handleValueChange} required placeholder='Startup Image URL' className='startup-form_input' />
                {errors.image && <p className='startup-form_error'>{errors.image}</p>}
            </div>

            <div data-color-mode="light">
                <label htmlFor="pitch" className='startup-form_label'>Pitch</label>
                <MDEditor
                    value={pitch}
                    onChange={(value) => setPitch(value as string)}
                    id='pitch'
                    preview='edit'
                    height={300}
                    style={{ borderRadius: 20, overflow: 'hidden' }}
                    textareaProps={{
                        placeholder: 'Briefly describe your idea and what problem it solves...',
                    }}
                    previewOptions={{
                        disallowedElements: ['style'],
                    }}
                />
                {errors.pitch && <p className='startup-form_error'>{errors.pitch}</p>}
            </div>

            <Button type='submit' className='startup-form_btn text-white' disabled={isPending}>
                {isPending ? 'Submitting...' : 'Submit Your Pitch'}
                <Send className='size-6' />
            </Button>
        </form>
    )
}

export default StartupForm