import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function chatHrefConstructor(id1: string, id2: string) {
	const sortedIds = [id1, id2].sort()
	return `${sortedIds[0]}--${sortedIds[1]}`
}

export function toPusherKey(key: string) {
	return key.replace(/:/g, '__') // replace : with __ because pusher doesn't allow : in channel names
}
