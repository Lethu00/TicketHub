"use client";
import EventsOrg from "@/components/events-org";
import React from "react";
import { useUser } from "@/lib/user-role";

const Page = () => {
	const { user } = useUser();
	const [allEvents, setAllEvents] = React.useState<any[]>([]);

	React.useEffect(() => {
		const fetchEvents = async () => {
			const mod = await import("@/lib/data.json");
			setAllEvents((mod.default || mod).events || []);
		};
		fetchEvents();
	}, []);

	// Filter events where the organiser is the creator
	const organiserEvents =
		user && user.id
			? allEvents.filter((event) => event.createdBy === user.id)
			: [];

	return (
		<div className="px-2 md:px-8 lg:px-32 py-8 w-full max-w-6xl mx-auto">
			<EventsOrg events={organiserEvents} />
		</div>
	);
};

export default Page;
