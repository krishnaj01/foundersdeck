"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";
import { StartupCardType } from "@/components/StartupCard";
import { v4 as uuidv4 } from 'uuid'; 

export const createPitch = async (state: any, form: FormData, pitch: string) => {
    const session = await auth();

    if (!session) {
        return parseServerActionResponse({
            error: "Not authenticated",
            status: "ERROR"
        });
    }

    const { title, description, category, image } = Object.fromEntries(
        Array.from(form).filter(([key]) => key !== "pitch")
    );

    const slug = slugify(title as string, { lower: true, strict: true });

    try {
        const startup = {
            title,
            description,
            category,
            image,
            slug: {
                _type: slug,
                current: slug,
            },
            author: {
                _type: "reference",
                _ref: session?.id,
            },
            pitch,
        }

        const result = await writeClient.create({ _type: 'startup', ...startup });
        return parseServerActionResponse({
            ...result,
            error: "",
            status: "SUCCESS"
        });

    } catch (error) {
        console.log(error);
        return parseServerActionResponse({
            error: JSON.stringify(error),
            status: "ERROR"
        });
    }
}

export const updatePitch = async (state: any, form: FormData, pitch: string, post: StartupCardType) => {
    const session = await auth();

    if (!session) {
        return parseServerActionResponse({
            error: "Not authenticated",
            status: "ERROR"
        });
    }

    const { title, description, category, image } = Object.fromEntries(
        Array.from(form).filter(([key]) => key !== "pitch")
    );

    try {
        const result = await writeClient.patch(post._id).set({
            title,
            description,
            category,
            image,
            pitch,
        }).commit();

        return parseServerActionResponse({
            ...result,
            error: "",
            status: "SUCCESS"
        });

    } catch (error) {
        console.log(error);
        return parseServerActionResponse({
            error: JSON.stringify(error),
            status: "ERROR"
        });
    }
}

export const vote = async (state: any, startupId: string, upvotes: string[]) => {
    const session = await auth();

    if (!session) {
        return parseServerActionResponse({
            error: "Not authenticated",
            status: "ERROR"
        });
    }

    try {
        const userId = session.id;
        if (!upvotes) upvotes = [];
        if (upvotes.includes(userId)) {
            upvotes = upvotes.filter(id => id !== userId); // Remove upvote (toggle)
        } else {
            upvotes.push(userId); // Add upvote
        }

        const result = await writeClient.patch(startupId).set({
            upvotes: upvotes.map(id => ({ _type: "reference", _ref: id, _key: uuidv4() }))
        }).commit();

        return parseServerActionResponse({
            ...result,
            error: "",
            status: "SUCCESS"
        });

    } catch (error) {
        console.log(error);
        return parseServerActionResponse({
            error: JSON.stringify(error),
            status: "ERROR"
        });
    }
}