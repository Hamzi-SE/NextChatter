'use client';

import { FC, useState } from 'react';
import Button from './ui/Button';
import { addFriendValidator } from '@/lib/validations/add-friend';
import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface AddFriendButtonProps {}

const AddFriendButton: FC<AddFriendButtonProps> = ({}) => {
	const [showSuccessState, setShowSuccessState] = useState<boolean>(false);

	type MyForm = z.infer<typeof addFriendValidator>; // { email: string }

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<MyForm>({
		resolver: zodResolver(addFriendValidator),
	});

	const addFriend = async (email: string) => {
		try {
			const validatedEmail = addFriendValidator.parse({ email });

			await axios.post('/api/friends/add', {
				email: validatedEmail,
			});

			setShowSuccessState(true);
		} catch (error) {
			if (error instanceof z.ZodError) {
				setError('email', { message: error.message });
				return console.log('Zod error', error);
			}

			if (error instanceof AxiosError) {
				setError('email', { message: error.response?.data });
				return console.log('Axios error', error);
			}

			setError('email', { message: 'Something went wrong' });
		}
	};

	const onSubmit = (data: MyForm) => {
		addFriend(data.email);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='max-w-sm'>
			<label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
				Add friend by email
			</label>

			<div className='mt-2 flex gap-4'>
				<input
					{...register('email')}
					type='text'
					className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
					placeholder='you@example.com'
				/>
				<Button>Add</Button>
			</div>

			{errors.email && <p className='mt-1 text-sm text-red-600'>{errors.email?.message}</p>}

			{showSuccessState && <p className='mt-1 text-sm text-green-600'>Friend request sent!</p>}
		</form>
	);
};

export default AddFriendButton;
