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
			return new Response('Unauthorized', { status: 401 });
		}

		const { id: idToCancel } = z.object({ id: z.string() }).parse(body);

        // Verify that the user has sent a friend request to the user they are trying to cancel
        const hasFriendRequest = await fetchRedis('sismember', `user:${session.user.id}:outgoing_friend_requests`, idToCancel) as 0 | 1;

        if (!hasFriendRequest) {
            return new Response("You have not sent this user a friend request", { status: 400 });
        }

        // Remove the friend request from the outgoing friend requests list
        await db.srem(`user:${session.user.id}:outgoing_friend_requests`, idToCancel);

        // Remove the friend request from the other user's incoming friend requests list
        await db.srem(`user:${idToCancel}:incoming_friend_requests`, session.user.id);

        return new Response('Friend request cancelled', { status: 200 });

    } catch (error) {
         console.error(error);

        if (error instanceof z.ZodError) {
            return new Response('Invalid request payload', { status: 422 });
        }

        return new Response('Invalid request', { status: 400 });
    }
}