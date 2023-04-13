interface User {
	name: string
	email: string
	image: string
	id: string
}

interface Message {
	id: string
	senderId: string
	receiverId: string
	text: string
	timestamp: number // unix timestamp = 1610000000000 // 2021-01-10 00:00:00
}

interface Chat {
	id: string
	messages: Message[]
	lastMessage: string // TODO: last message text
}

interface FriendRequest {
	id: string
	senderId: string
	receiverId: string
	timestamp: number // TODO
}
