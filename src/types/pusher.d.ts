interface IncomingFriendRequest {
    senderId: string;
    senderEmail: string | null | undefined;
}

interface OutgoingFriendRequest {
    receiverId: string;
    receiverEmail: string | null | undefined;
}