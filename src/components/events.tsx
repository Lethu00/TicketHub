"use client";
import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
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

function getEventBadges(event: Event) {
	const badges = [];
	// Just posted: within 3 days of dateCreated
	if (event.dateCreated) {
		const postedDate = new Date(event.dateCreated);
		const now = new Date();
		const daysAgo =
			(now.getTime() - postedDate.getTime()) / (1000 * 60 * 60 * 24);
		if (daysAgo <= 3) {
			badges.push({ label: "Just Posted", type: "new" });
		}
	}
	// Ticket sales
	if (event.ticketsAvailable && event.ticketsPurchased !== undefined) {
		const percent = (event.ticketsPurchased / event.ticketsAvailable) * 100;
		if (percent >= 100) {
			badges.push({ label: "Sold Out", type: "soldout" });
		} else if (percent >= 80) {
			badges.push({ label: "80% Sold", type: "eighty" });
		} else if (percent >= 50) {
			badges.push({ label: "50% Sold", type: "fifty" });
		}
	}
	return badges;
}

export default function Events() {
	const [events, setEvents] = React.useState<Event[]>([]);
	const [loading, setLoading] = React.useState(true);

	console.log(loading);
	React.useEffect(() => {
		setLoading(true);
		import("@/lib/data.json")
			.then((mod) => {
				setEvents((mod.default || mod).events || []);
				setLoading(false);
			})
			.catch(() => setLoading(false));
	}, []);

	// Categorize events
	const lastMinuteEvents = events.filter((event) => {
		const badges = getEventBadges(event);
		return badges.some((b) => b.type === "eighty");
	});
	const musicEvents = events.filter(
		(e) => e.category?.toLowerCase() === "music"
	);
	const festivalEvents = events.filter(
		(e) => e.category?.toLowerCase() === "festival"
	);
	const conferenceEvents = events.filter(
		(e) => e.category?.toLowerCase() === "conference"
	);
	const allOtherEvents = events.filter(
		(e) =>
			!lastMinuteEvents.includes(e) &&
			!musicEvents.includes(e) &&
			!festivalEvents.includes(e) &&
			!conferenceEvents.includes(e)
	);

	const renderEventCard = (event: Event) => {
		const badges = getEventBadges(event);
		const isSoldOut = badges.some((b) => b.type === "soldout");
		return (
			<Link
				key={event.id}
				href={`/event/${event.id}`}
				className="group"
				tabIndex={0}
			>
				<Card className="flex flex-col rounded-xl overflow-hidden shadow-lg pt-0 gap-0 transition-transform duration-150 group-hover:scale-95 group-focus:scale-95 cursor-pointer relative h-auto">
					<div className="relative w-full h-auto aspect-square">
						<Image
							src={event.image}
							alt={event.title}
							fill
							className="object-cover bg-accent"
							sizes="(max-width: 900px) 100vw, 400px"
							priority={false}
						/>
						{/* Badges in image area */}
						<div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
							{badges.map((badge, i) =>
								badge.type === "new" ? (
									<span
										key={i}
										className="bg-pink-600 text-white text-xs font-semibold px-2 py-1 rounded shadow"
									>
										{badge.label}
									</span>
								) : null
							)}
							{badges.map((badge, i) =>
								badge.type === "fifty" ? (
									<span
										key={i}
										className="bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded shadow"
									>
										{badge.label}
									</span>
								) : badge.type === "eighty" ? (
									<span
										key={i}
										className="bg-orange-600 text-white text-xs font-semibold px-2 py-1 rounded shadow"
									>
										{badge.label}
									</span>
								) : null
							)}
						</div>
						{/* Sold Out overlay */}
						{isSoldOut && (
							<div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20">
								<span className="bg-white text-pink-700 text-lg font-bold px-6 py-3 rounded shadow-xl border-2 border-pink-600 animate-pulse">
									Sold Out
								</span>
							</div>
						)}
					</div>
					<div className="flex-1 p-4 flex flex-col justify-between">
						<h3 className="text-lg font-semibold mb-1">{event.title}</h3>
						<p className="text-sm text-gray-600 mb-1">
							{event.date} | {event.location}
						</p>
						<p className="text-xs text-gray-500 line-clamp-2">
							{event.description}
						</p>
					</div>
				</Card>
			</Link>
		);
	};

	return (
		<section className="w-full px-2 md:px-8 lg:px-20 py-8">
			<h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>

			{/* Last Minute Buys */}
			{lastMinuteEvents.length > 0 && (
				<div className="mb-10">
					<h3 className="text-xl font-bold mb-4 text-orange-600">
						Last Minute Buys (80%+ Sold)
					</h3>
					<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{lastMinuteEvents.map(renderEventCard)}
					</div>
				</div>
			)}

			{/* Music Events */}
			{musicEvents.length > 0 && (
				<div className="mb-10">
					<h3 className="text-xl font-bold mb-4 text-pink-600">Music Events</h3>
					<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{musicEvents.map(renderEventCard)}
					</div>
				</div>
			)}

			{/* Festival Events */}
			{festivalEvents.length > 0 && (
				<div className="mb-10">
					<h3 className="text-xl font-bold mb-4 text-green-600">Festivals</h3>
					<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{festivalEvents.map(renderEventCard)}
					</div>
				</div>
			)}

			{/* Conference Events */}
			{conferenceEvents.length > 0 && (
				<div className="mb-10">
					<h3 className="text-xl font-bold mb-4 text-blue-600">Conferences</h3>
					<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{conferenceEvents.map(renderEventCard)}
					</div>
				</div>
			)}

			{/* All Other Events */}
			{allOtherEvents.length > 0 && (
				<div className="mb-10">
					<h3 className="text-xl font-bold mb-4 text-gray-700">All Events</h3>
					<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{allOtherEvents.map(renderEventCard)}
						{/* Include 80% sold events under All Events as well */}
						{lastMinuteEvents.map(renderEventCard)}
					</div>
				</div>
			)}
		</section>
	);
}
