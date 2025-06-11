"use client";
import EventsOrg from "@/components/events-org";
import React from "react";
import { useUser } from "@/lib/user-role";
import DashboardOrg from "@/components/dashboard-org";

type Event = {
	id: string;
	createdBy: string;
	title: string;
	date: string;
	location: string;
	image: string;
	// Add other event properties as needed
};

const Page = () => {
	const { user } = useUser();
	const [allEvents, setAllEvents] = React.useState<Event[]>([]);

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
		<div>
			<DashboardOrg middleComponent={<EventsOrg events={organiserEvents} />} />
		</div>
	);
};

export default Page;
