import React from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";

type Event = {
	id: string;
	title: string;
	date: string;
	location: string;
	image: string;
	description?: string;
	category?: string;
};

type EventsOrgProps = {
	events: Event[];
};

const EventsOrg: React.FC<EventsOrgProps> = ({ events }) => {
	if (!events || events.length === 0) {
		return (
			<div className="text-center text-gray-500 py-10">
				You have not created any events yet.
			</div>
		);
	}

	return (
		<div className="w-full pt-6 pb-8">
			<h2 className="text-2xl font-bold mb-6">Your Organised Events</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{events.map((event) => (
					<Card
						key={event.id}
						className="flex flex-col rounded-xl overflow-hidden shadow-lg pt-0 gap-0"
					>
						<div className="relative w-full aspect-square">
							<Image
								src={event.image}
								alt={event.title}
								fill
								className="object-cover"
								sizes="(max-width: 900px) 100vw, 400px"
							/>
						</div>
						<div className="p-4 flex flex-col flex-1">
							<h3 className="text-lg font-semibold mb-1">{event.title}</h3>
							<p className="text-sm text-gray-600 mb-1">
								{event.date} | {event.location}
							</p>
							{event.description && (
								<p className="text-xs text-gray-500 line-clamp-2">
									{event.description}
								</p>
							)}
							{event.category && (
								<span className="mt-2 inline-block text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded">
									{event.category}
								</span>
							)}
						</div>
					</Card>
				))}
			</div>
		</div>
	);
};

export default EventsOrg;
