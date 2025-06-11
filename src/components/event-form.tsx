"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import ImageUploader from "@/components/image-uploader";
import { useUser } from "@/lib/user-role";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";

type EventFormProps = {
	onCreated?: () => void;
	loading?: boolean;
};

const EventForm: React.FC<EventFormProps> = ({ onCreated, loading }) => {
	const { user } = useUser();
	const router = useRouter();
	const [title, setTitle] = useState("");
	const [date, setDate] = useState("");
	const [location, setLocation] = useState("");
	const [category, setCategory] = useState("");
	const [description, setDescription] = useState("");
	const [image, setImage] = useState<string | null>(null);
	const [tags, setTags] = useState<string>("");
	const [ticketCost, setTicketCost] = useState("");
	const [ticketsAvailable, setTicketsAvailable] = useState("");
	const [onPromotion, setOnPromotion] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [showFallback, setShowFallback] = useState(false);

	const handleImageUpload = (imgUrl: string) => {
		setImage(imgUrl);
	};

	// const getFallbackIcon = () => {
	// 	if (category && categoryIcons[category]) return categoryIcons[category];
	// 	if (tags) {
	// 		const tagArr = tags.split(",").map((t) => t.trim().toLowerCase());
	// 		if (tagArr.includes("music")) return categoryIcons["Music"];
	// 		if (tagArr.includes("festival")) return categoryIcons["Festival"];
	// 		if (tagArr.includes("conference")) return categoryIcons["Conference"];
	// 		if (tagArr.includes("community")) return categoryIcons["Community"];
	// 	}
	// 	return categoryIcons["Default"];
	// };
	console.log(showFallback);
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setShowFallback(true); // Only show fallback if no image on submit
		setConfirmOpen(true);
	};

	const handleConfirmCreate = async () => {
		if (!user || !user.id) {
			toast.error("You must be logged in as an organiser to create an event.");
			return;
		}
		setSubmitting(true);
		try {
			const mod = await import("@/lib/data.json");
			const data = mod.default || mod;
			const eventImage = image || "";

			// Define a User type for type safety
			type User = {
				id: string;
				eventsOrganized?: string[];
				// add other user fields as needed
			};

			// Simulate image save failure
			if (image && eventImage === "") {
				toast.warning(
					"Event image could not be saved. The event will be created without an image."
				);
			}

			const newEvent = {
				id: crypto.randomUUID(),
				title,
				date,
				location,
				category,
				description,
				image: eventImage,
				tags: tags
					.split(",")
					.map((t) => t.trim())
					.filter(Boolean),
				createdBy: user.id,
				dateCreated: new Date().toISOString(),
				ticketsAvailable: Number(ticketsAvailable) || 0,
				ticketCost: Number(ticketCost) || 0,
				ticketsPurchased: 0,
				onPromotion,
			};
			data.events.push(newEvent);

			// Link event to organiser (if you store event IDs on user)
			const organiser = (data.users as User[]).find((u) => u.id === user.id);
			if (organiser) {
				organiser.eventsOrganized = organiser.eventsOrganized || [];
				organiser.eventsOrganized.push(newEvent.id);
			}

			setConfirmOpen(false);
			toast.success("Event created!");
			if (onCreated) onCreated();

			// Reset form
			setTitle("");
			setDate("");
			setLocation("");
			setCategory("");
			setDescription("");
			setImage(null);
			setTags("");
			setTicketCost("");
			setTicketsAvailable("");
			setOnPromotion(false);
			setShowFallback(false);

			// Redirect to organiser my-events
			setTimeout(() => {
				router.push("/organiser/my-events");
			}, 800);
		} catch {
			toast.error("Failed to create event.");
		} finally {
			setSubmitting(false);
		}
	};
	console.log(loading);

	return (
		<>
			<Card className="max-w-3xl mx-auto my-8">
				<CardContent className="p-8">
					<form
						onSubmit={handleSubmit}
						className="grid grid-cols-1 lg:grid-cols-2 gap-8"
					>
						{/* Left: Image & Category, Event Date */}
						<div className="flex flex-col items-center gap-4 w-full">
							<div className="w-32 h-32  items-center justify-center bg-gray-100 rounded-lg border hidden">
								{image ? (
									<Image
										src={image}
										alt="Event"
										className="w-32 h-32 object-cover rounded-lg "
									/>
								) : null}
							</div>
							<ImageUploader onUpload={handleImageUpload} />
							<div className="w-full">
								<Label htmlFor="category" className="font-semibold">
									Category
								</Label>
								<Select value={category} onValueChange={setCategory} required>
									<SelectTrigger className="w-full mt-1">
										<SelectValue placeholder="Select Category" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Music">Music</SelectItem>
										<SelectItem value="Festival">Festival</SelectItem>
										<SelectItem value="Conference">Conference</SelectItem>
										<SelectItem value="Community">Community</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="w-full">
								<Label htmlFor="date" className="font-semibold">
									Event Date
								</Label>
								<Input
									id="date"
									type="date"
									placeholder="Event Date"
									value={date}
									onChange={(e) => setDate(e.target.value)}
									required
									className="mt-1"
								/>
							</div>
							<div className="w-full flex items-center gap-2 mt-2">
								<Switch
									id="onPromotion"
									checked={onPromotion}
									onCheckedChange={setOnPromotion}
								/>
								<Label htmlFor="onPromotion" className="font-medium">
									Promote this event
								</Label>
							</div>
						</div>
						{/* Right: Details */}
						<div className="flex flex-col gap-4">
							<div>
								<Label htmlFor="title" className="font-semibold">
									Event Title
								</Label>
								<Input
									id="title"
									type="text"
									placeholder="Event Title"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									required
									className="mt-1"
								/>
							</div>
							<div>
								<Label htmlFor="location" className="font-semibold">
									Location
								</Label>
								<Input
									id="location"
									type="text"
									placeholder="Location"
									value={location}
									onChange={(e) => setLocation(e.target.value)}
									required
									className="mt-1"
								/>
							</div>
							<div>
								<Label htmlFor="tags" className="font-semibold">
									Tags (comma separated)
								</Label>
								<Input
									id="tags"
									type="text"
									placeholder="Tags (comma separated)"
									value={tags}
									onChange={(e) => setTags(e.target.value)}
									className="mt-1"
								/>
							</div>
							<div>
								<Label htmlFor="ticketCost" className="font-semibold">
									Ticket Cost (USD)
								</Label>
								<Input
									id="ticketCost"
									type="number"
									min={0}
									placeholder="Ticket Cost"
									value={ticketCost}
									onChange={(e) => setTicketCost(e.target.value)}
									required
									className="mt-1"
								/>
							</div>
							<div>
								<Label htmlFor="ticketsAvailable" className="font-semibold">
									Tickets Available
								</Label>
								<Input
									id="ticketsAvailable"
									type="number"
									min={1}
									placeholder="Number of Tickets"
									value={ticketsAvailable}
									onChange={(e) => setTicketsAvailable(e.target.value)}
									required
									className="mt-1"
								/>
							</div>
							<div>
								<Label htmlFor="description" className="font-semibold">
									Event Description
								</Label>
								<Textarea
									id="description"
									className="mt-1 min-h-[80px]"
									placeholder="Event Description"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									required
								/>
							</div>
						</div>
						{/* Submit button: full width, below everything in lg: */}
						<div className="col-span-1 lg:col-span-2">
							<Button
								type="submit"
								className="w-full mt-2"
								disabled={loading || submitting}
							>
								{loading || submitting ? "Creating..." : "Create Event"}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
			<AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Confirm Event Creation</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to create this event? Please review your
							details before confirming.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel asChild>
							<Button variant="outline" type="button">
								Cancel
							</Button>
						</AlertDialogCancel>
						<AlertDialogAction asChild>
							<Button
								onClick={handleConfirmCreate}
								disabled={submitting}
								type="button"
							>
								{submitting ? "Creating..." : "Confirm"}
							</Button>
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default EventForm;
