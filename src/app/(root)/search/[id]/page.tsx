"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Card } from "@/components/ui/card";

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

export default function SearchResultsPage() {
	const params = useParams();
	const idParam = params.id;
	const searchTerm = decodeURIComponent(
		Array.isArray(idParam) ? idParam[0] : idParam || ""
	);
	const [events, setEvents] = useState<Event[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		import("@/lib/data.json")
			.then((mod) => {
				const allEvents = ((mod.default || mod).events as Event[]) || [];
				const filtered = allEvents.filter((event: Event) => {
					const term = searchTerm.toLowerCase();
					return (
						event.title.toLowerCase().includes(term) ||
						event.location.toLowerCase().includes(term) ||
						event.description.toLowerCase().includes(term) ||
						event.category?.toLowerCase().includes(term)
					);
				});
				setEvents(filtered);
				setLoading(false);
			})
			.catch(() => setLoading(false));
	}, [searchTerm]);

	return (
		<section className="w-full px-2 md:px-8 lg:px-20 py-8">
			<h2 className="text-2xl font-bold mb-6">
				Search Results for: <span className="text-pink-600">{searchTerm}</span>
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{loading ? (
					Array.from({ length: 4 }).map((_, i) => (
						<div
							key={i}
							className="animate-pulse rounded-xl overflow-hidden shadow-lg bg-gray-200 h-80 flex flex-col"
						>
							<div className="bg-gray-300 h-1/2 w-full" />
							<div className="flex-1 p-4 space-y-2">
								<div className="h-4 bg-gray-300 rounded w-3/4" />
								<div className="h-3 bg-gray-300 rounded w-1/2" />
								<div className="h-3 bg-gray-300 rounded w-1/3" />
							</div>
						</div>
					))
				) : events.length === 0 ? (
					<div className="col-span-full text-center text-gray-500">
						No events found.
					</div>
				) : (
					events.map((event) => (
						<Card
							key={event.id}
							className="flex flex-col rounded-xl overflow-hidden shadow-lg h-80 pt-0 gap-2"
						>
							<div className="relative h-[60%] w-full">
								<Image
									src={event.image}
									alt={event.title}
									fill
									className="object-cover bg-accent"
									sizes="(max-width: 900px) 100vw, 400px"
									priority={false}
								/>
							</div>
							<div className="flex-1 p-4 pt-0 flex flex-col justify-between h-40">
								<h3 className="text-lg font-semibold mb-1">{event.title}</h3>
								<p className="text-sm text-gray-600 mb-1">
									{event.date} | {event.location}
								</p>
								<p className="text-xs text-gray-500 line-clamp-2">
									{event.description}
								</p>
							</div>
						</Card>
					))
				)}
			</div>
		</section>
	);
}
