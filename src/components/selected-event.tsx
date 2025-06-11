"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Logo from "@/components/logo"; // Make sure you have a Logo component
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
	AlertDialogTitle,
	AlertDialogDescription,
} from "../components/ui/alert-dialog";

// Props: event, user, onPurchase (callback to update data)
type Event = {
	id: string;
	image: string;
	title: string;
	date: string;
	location: string;
	description: string;
	ticketsAvailable?: number;
	ticketCost?: number;
	ticketsPurchased?: number;
	category?: string;
};

type User = {
	id: string;
	name: string;
	role: string;
	// ...other fields
};

export default function SelectedEvent({
	event,
	user,
	onPurchase,
}: {
	event: Event;
	user: User | null;
	onPurchase: (count: number) => Promise<void>;
}) {
	const [count, setCount] = useState(1);
	const [purchasing, setPurchasing] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState("");
	const [showConfirm, setShowConfirm] = useState(false);

	// Track tickets left locally so UI updates after purchase
	const [ticketsLeft, setTicketsLeft] = useState(
		event.ticketsAvailable! - (event.ticketsPurchased || 0)
	);

	const handlePurchase = async () => {
		setError("");
		if (!user || user.role !== "attendee") {
			setError("You must be logged in as an attendee to purchase tickets.");
			return;
		}
		setShowConfirm(true);
	};

	const confirmPurchase = async () => {
		setPurchasing(true);
		setError("");
		try {
			await onPurchase(count);
			setSuccess(true);
			// Update tickets left locally
			setTicketsLeft((prev) => prev - count);
			toast.success(
				`Ticket${
					count > 1 ? "s" : ""
				} purchased! You can now print your ticket or view it in your account.`
			);
			setShowConfirm(false);
		} catch {
			setError("Could not complete purchase. Please try again.");
		} finally {
			setPurchasing(false);
		}
	};

	return (
		<Card className="flex flex-col md:flex-row w-full max-w-4xl mx-auto my-8 overflow-hidden shadow-lg py-0">
			{/* Image left */}
			<div className="relative w-full md:w-1/2 h-full md:h-auto min-h-[300px]">
				<Image
					src={event.image}
					alt={event.title}
					fill
					className="object-cover"
					sizes="(max-width: 900px) 100vw, 400px"
				/>
			</div>
			{/* Info right */}
			<div className="flex-1 p-6 flex flex-col w-full justify-between">
				<div>
					<h2 className="text-2xl font-bold mb-2">{event.title}</h2>
					<p className="text-gray-600 mb-1">
						{event.date} | {event.location}
					</p>
					<p className="text-gray-500 mb-4">{event.description}</p>
					<div className="flex items-center gap-4 mb-2">
						<span className="font-semibold text-lg text-pink-600">
							R{event.ticketCost}
						</span>
						<span className="text-xs text-gray-400">
							{ticketsLeft} tickets left
						</span>
					</div>
				</div>
				<div className="flex items-center gap-4 mt-4">
					<label htmlFor="ticket-count" className="text-sm">
						Tickets:
					</label>
					<input
						id="ticket-count"
						type="number"
						min={1}
						max={event.ticketsAvailable! - (event.ticketsPurchased || 0)}
						value={count}
						onChange={(e) =>
							setCount(
								Math.max(
									1,
									Math.min(
										Number(e.target.value),
										event.ticketsAvailable! - (event.ticketsPurchased || 0)
									)
								)
							)
						}
						className="w-16 border rounded px-2 py-1 text-center"
						disabled={purchasing || success}
					/>
					<AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
						<AlertDialogTrigger asChild>
							<Button
								onClick={handlePurchase}
								disabled={
									purchasing ||
									success ||
									event.ticketsAvailable! - (event.ticketsPurchased || 0) < 1
								}
							>
								{purchasing ? "Purchasing..." : "Purchase"}
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<div className="flex flex-col items-center gap-2">
									<Logo className="w-12 h-12 mb-2" />
									<AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
								</div>
							</AlertDialogHeader>
							<AlertDialogDescription className="text-center mb-4">
								Are you sure you want to purchase {count} ticket
								{count > 1 ? "s" : ""} for{" "}
								<span className="font-semibold">{event.title}</span>?
							</AlertDialogDescription>
							<AlertDialogFooter className="flex justify-center gap-4">
								<AlertDialogCancel
									disabled={purchasing}
									className="bg-gray-200"
								>
									Cancel
								</AlertDialogCancel>
								<AlertDialogAction
									className="bg-pink-600 text-white"
									onClick={confirmPurchase}
									disabled={purchasing}
								>
									{purchasing ? "Purchasing..." : "Yes, Purchase"}
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
				{error && <div className="text-red-600 text-sm mt-2">{error}</div>}
				{success && (
					<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4">
						Ticket(s) purchased! You can now print your ticket or view it in
						your account.
					</div>
				)}
			</div>
		</Card>
	);
}
