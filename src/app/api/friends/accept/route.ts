import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        const session = await getServerSession(authOptions);

        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }
        
        const {id: idToAdd} = z.object({id: z.string()}).parse(body);

        
        // Verify that the user is not already friends with the user they are trying to add
        const isAlreadyFriends = await fetchRedis('sismember', `user:${session.user.id}:friends`, idToAdd) as 0 | 1
        
        if (isAlreadyFriends) {
            return new Response("You are already friends", { status: 400 });
        }

        const hasFriendRequest = await fetchRedis('sismember', `user:${session.user.id}:incoming_friend_requests`, idToAdd) as 0 | 1

        if (!hasFriendRequest) {
            return new Response("This user has not sent you a friend request", { status: 400 });
        }

        // Add the user to the friends list
        await db.sadd(`user:${session.user.id}:friends`, idToAdd);
        
        // Add the user to the other user's friends list
        await db.sadd(`user:${idToAdd}:friends`, session.user.id);
        
        // Remove the friend request from the incoming friend requests list
        await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd);

        // Remove the friend request from the other user's outgoing friend requests list
        await db.srem(`user:${idToAdd}:outgoing_friend_requests`, session.user.id);


        return new Response("Friend request accepted", { status: 200 });

    } catch (error) {
        console.error(error);
        
        if (error instanceof z.ZodError) {
            return new Response('Invalid request payload', { status: 422 });
        }

        return new Response("Invalid request", { status: 400 });
    }
}