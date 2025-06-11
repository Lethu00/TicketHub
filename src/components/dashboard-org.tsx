"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Doughnut, Line } from "react-chartjs-2";
import { useUser } from "@/lib/user-role";
import { DollarSign, Ticket, Percent, Calendar } from "lucide-react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	PointElement,
	LineElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	PointElement,
	LineElement,
	ArcElement,
	Title,
	Tooltip,
	Legend
);

interface EventData {
	title: string;
	createdBy: string;
	ticketsPurchased?: number;
	ticketCost?: number;
	ticketsAvailable?: number;
}

type DashboardOrgProps = {
	middleComponent?: React.ReactNode;
};

const getRandomRevenuePattern = (total: number, points = 6) => {
	// Generate a random pattern that increases and ends at total
	const arr = [];
	for (let i = 0; i < points - 1; i++) {
		const next = Math.round(
			Math.random() * (total / points) + (total * i) / points
		);
		arr.push(next);
	}
	arr.push(total);
	return arr;
};

const DashboardOrg: React.FC<DashboardOrgProps> = ({ middleComponent }) => {
	const { user } = useUser();
	const [stats, setStats] = useState({
		events: 0,
		ticketsSold: 0,
		revenue: 0,
		percentageSold: 0,
		eventsData: [] as EventData[],
	});

	useEffect(() => {
		const fetchStats = async () => {
			const mod = await import("@/lib/data.json");
			const data = mod.default || mod;
			const events = data.events.filter(
				(e: EventData) => e.createdBy === user?.id
			);
			const eventsCount = events.length;
			const ticketsSold = events.reduce(
				(sum: number, e: EventData) => sum + (e.ticketsPurchased || 0),
				0
			);
			const revenue = events.reduce(
				(sum: number, e: EventData) =>
					sum + (e.ticketsPurchased || 0) * (e.ticketCost || 0),
				0
			);
			const ticketsAvailable = events.reduce(
				(sum: number, e: EventData) => sum + (e.ticketsAvailable || 0),
				0
			);
			const percentageSold =
				ticketsAvailable > 0
					? Math.round((ticketsSold / ticketsAvailable) * 100)
					: 0;

			setStats({
				events: eventsCount,
				ticketsSold,
				revenue,
				percentageSold,
				eventsData: events,
			});
		};
		if (user?.id) fetchStats();
	}, [user]);

	const totalTicketsSold = stats.eventsData.reduce(
		(sum, e) => sum + (e.ticketsPurchased || 0),
		0
	);
	const totalTicketsAvailable = stats.eventsData.reduce(
		(sum, e) => sum + (e.ticketsAvailable || 0),
		0
	);

	// Donut: sold vs unsold (works for multiple events)
	const doughnutData = {
		labels: ["Tickets Sold", "Tickets Remaining"],
		datasets: [
			{
				label: "Tickets",
				data: [
					totalTicketsSold,
					Math.max(totalTicketsAvailable - totalTicketsSold, 0),
				],
				backgroundColor: ["#db2777", "#e5e7eb"],
			},
		],
	};

	// Line: randomised revenue pattern per event, ending at actual revenue
	// const lineLabels = stats.eventsData.map((e) => e.title);
	const lineDatasets = stats.eventsData.map((e, idx) => {
		const total = (e.ticketsPurchased || 0) * (e.ticketCost || 0);
		const pattern = getRandomRevenuePattern(total);
		return {
			label: e.title,
			data: pattern,
			borderColor: [
				"#db2777",
				"#fbbf24",
				"#10b981",
				"#3b82f6",
				"#6366f1",
				"#f472b6",
				"#f87171",
				"#34d399",
			][idx % 8],
			backgroundColor: "rgba(219, 39, 119, 0.1)",
			tension: 0.4,
			fill: false,
		};
	});

	const lineData = {
		labels: Array.from({ length: 6 }, (_, i) => `Step ${i + 1}`),
		datasets: lineDatasets,
	};

	return (
		<div className="w-full max-w-6xl mx-auto py-8">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<Card>
					<CardHeader className="flex flex-row items-center gap-2">
						<Calendar className="text-pink-600" />
						<CardTitle className="text-base">Events</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.events}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center gap-2">
						<Ticket className="text-pink-600" />
						<CardTitle className="text-base">Tickets Sold</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{totalTicketsSold}/{totalTicketsAvailable}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center gap-2">
						<DollarSign className="text-pink-600" />
						<CardTitle className="text-base">Revenue</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">${stats.revenue}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center gap-2">
						<Percent className="text-pink-600" />
						<CardTitle className="text-base">% Sold</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{totalTicketsAvailable > 0
								? Math.round((totalTicketsSold / totalTicketsAvailable) * 100)
								: 0}
							%
						</div>
					</CardContent>
				</Card>
			</div>
			{/* Optional middle component */}
			{middleComponent && <div className="mb-8 -mt-8">{middleComponent}</div>}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<Card>
					<CardHeader>
						<CardTitle>Tickets Sold</CardTitle>
					</CardHeader>
					<CardContent className="flex items-center justify-center">
						<div
							style={{
								width: "260px",
								height: "260px",
								position: "relative",
							}}
						>
							<Doughnut
								data={doughnutData}
								options={{
									maintainAspectRatio: false,
									cutout: "65%",
									plugins: {
										legend: { position: "bottom" },
									},
								}}
							/>
							<div className="absolute text-center w-full top-[35%] pointer-events-none">
								<span className="relative flex justify-center text-lg font-bold">
									{totalTicketsSold}/{totalTicketsAvailable}
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Revenue per Event</CardTitle>
					</CardHeader>
					<CardContent>
						<Line
							data={lineData}
							options={{
								plugins: {
									legend: { position: "bottom" },
								},
								scales: {
									y: {
										beginAtZero: true,
									},
								},
							}}
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default DashboardOrg;
