"use client";
import React, { useMemo } from "react";
import { useUser } from "@/lib/user-role";
import Ticket from "@/components/tickets";
import data from "@/lib/data.json";
import { Button } from "@/components/ui/button";

type Event = {
	id: string;
	image: string;
	title: string;
	date: string;
	location: string;
	description: string;
	onPromotion: boolean;
	createdBy: string;
	dateCreated: string;
	ticketsAvailable: number;
	ticketCost: number;
	ticketsPurchased: number;
	category: string;
};

type TicketType = {
	eventId: string;
	quantity?: number;
	purchasedAt?: number;
};

export default function MyTicketsPage() {
	const { user } = useUser();

	// Find tickets for the current user
	const userTickets = useMemo(() => {
		if (!user) return [];
		const found = data.users.find((u) => u.id === user.id);
		if (!found || !found.tickets) return [];
		return found.tickets
			.map((ticket: TicketType) => {
				const event = data.events.find((e: Event) => e.id === ticket.eventId);
				if (!event) return null;
				return {
					...ticket,
					event,
				};
			})
			.filter((t): t is TicketType & { event: Event } => t !== null)
			.sort((a, b) => (b.purchasedAt || 0) - (a.purchasedAt || 0));
	}, [user]);

	const handlePrint = () => {
		window.print();
	};

	// Download a single ticket as an image (for PDF, use browser print dialog)

	if (!user) {
		return (
			<div className="max-w-xl mx-auto mt-10 text-center text-lg">
				Please log in to view your tickets.
			</div>
		);
	}

	if (userTickets.length === 0) {
		return (
			<div className="max-w-xl mx-auto mt-10 text-center text-lg">
				You have no tickets yet.
			</div>
		);
	}

	// Group tickets by event name
	const grouped = userTickets.reduce<
		Record<string, (TicketType & { event: Event })[]>
	>((acc, ticket) => {
		const name = ticket.event.title;
		if (!acc[name]) acc[name] = [];
		acc[name].push(ticket);
		return acc;
	}, {});

	return (
		<div className="max-w-3xl mx-auto py-8">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">My Tickets</h1>
				<Button
					onClick={handlePrint}
					className="bg-pink-600 text-white print:hidden"
				>
					Print as PDF
				</Button>
			</div>
			{Object.entries(grouped).map(
				([eventName, tickets]: [string, (TicketType & { event: Event })[]]) => (
					<div key={eventName} className="mb-8">
						<h2 className="text-xl font-semibold mb-3">{eventName}</h2>
						<div className="flex flex-col gap-4">
							{tickets.map((ticket, idx: number) =>
								Array.from({ length: ticket.quantity || 1 }).map((_, i) => (
									<div
										key={ticket.event.id + idx + "-" + i}
										id={`ticket-${ticket.event.id}-${idx}-${i}`}
										className="break-inside-avoid"
									>
										<Ticket
											event={ticket.event}
											user={user}
											ticketIndex={i}
											total={ticket.quantity || 1}
										/>
									</div>
								))
							)}
						</div>
					</div>
				)
			)}
		</div>
	);
}
