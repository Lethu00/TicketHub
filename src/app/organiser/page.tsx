"use client";
import EventsOrg from "@/components/events-org";
import React from "react";
import { useUser } from "@/lib/user-role";
import DashboardOrg from "@/components/dashboard-org";

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
		<div>
			<DashboardOrg middleComponent={<EventsOrg events={organiserEvents} />} />
		</div>
	);
};

export default Page;
