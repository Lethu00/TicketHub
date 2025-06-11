"use client";
import SelectedEvent from "@/components/selected-event";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Event = {
	id: string;
	image: string;
	title: string;
	date: string;
	location: string;
	description: string;
	onPromotion?: boolean;
	createdBy?: string;
	dateCreated?: string;
	ticketsAvailable?: number;
	ticketCost?: number;
	ticketsPurchased?: number;
	category?: string;
};

const Page = () => {
	const { id } = useParams();
	const [event, setEvent] = useState<Event | null>(null);
	// TODO: Replace with real user context
	const user = null;

	useEffect(() => {
		import("@/lib/data.json").then((mod) => {
			const events = ((mod.default || mod).events as Event[]) || [];
			const found = events.find((e) => e.id === id);
			setEvent(found || null);
		});
	}, [id]);

	// Simulate purchase logic (should update data.json and user in real app)
	const handlePurchase = async () => {
		// Implement real update logic here
		return new Promise<void>((resolve) => setTimeout(resolve, 1000));
	};

	if (!event)
		return (
			<div className="text-center py-12 text-gray-500">Loading event...</div>
		);

	return (
		<div>
			<div className="flex text-center mx-4 lg:mx-8 my-4">
				<Link href="/" className="text-foreground hover:underline">
					Home
				</Link>
				<span className="block pl-1"> | Event | {event.title}</span>
			</div>
			<div className="px-2 md:px-8 lg:px-32 py-8 w-full max-w-6xl mx-auto">
				<SelectedEvent event={event} user={user} onPurchase={handlePurchase} />
			</div>
		</div>
	);
};

export default Page;
