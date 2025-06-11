import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type TicketProps = {
	event: {
		id: string;
		title: string;
		date: string;
		location: string;
		image: string;
	};
	user: {
		id: string;
		name: string;
		email: string;
	};
	// Each ticket is for a single entry
	ticketIndex: number;
	total: number;
};

export default function Ticket({
	event,
	user,
	ticketIndex,
	total,
}: TicketProps) {
	const ticketData = {
		eventId: event.id,
		userId: user.id,
		email: user.email,
		ticketNumber: ticketIndex + 1,
	};

	const ref = useRef<HTMLDivElement>(null);

	// Print only this ticket
	const handlePrint = () => {
		if (!ref.current) return;
		const ticket = {
			title: event.title,
			date: event.date,
			location: event.location,
			image: event.image,
			user: user.name,
			ticketNumber: ticketIndex + 1,
			total,
			qr: (
				document.querySelector(
					`#ticket-qr-${event.id}-${ticketIndex}`
				) as HTMLElement
			)?.outerHTML,
		};
		const printWindow = window.open("", "_blank", "width=900,height=600");
		if (!printWindow) return;
		printWindow.document.write(`
			<html>
				<head>
					<title>Print Ticket</title>
					<style>
						body { margin: 0; padding: 0; background: #fff; font-family:helvetica, Arial, sans-serif; }
						.ticket-print-container {
							display: flex;
							max-width: 900px;
							border-radius: 0.75rem;
							overflow: hidden;
							box-shadow: 0 2px 8px rgba(0,0,0,0.08);
							background: #fff;
							margin: 40px auto;
							min-height: 260px;
						}
						.ticket-print-image {
							width: 33.3333%;
							min-width: 180px;
							height: 260px;
							overflow: hidden;
						}
						.ticket-print-image img {
							width: 100%;
							height: 100%;
							object-fit: cover;
							border-top-left-radius: 0.75rem;
							border-bottom-left-radius: 0.75rem;
						}
						.ticket-print-details {
							flex: 1;
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							padding: 1.5rem;
							position: relative;
						}
						.ticket-print-title {
							font-size: 1.5rem;
							font-weight: bold;
							color: #db2777;
							margin-bottom: 0.25rem;
						}
						.ticket-print-meta {
							color: #374151;
							font-size: 1rem;
							margin-bottom: 0.25rem;
						}
						.ticket-print-user {
							color: #6b7280;
							font-size: 0.875rem;
							margin-bottom: 0.25rem;
						}
						.ticket-print-number {
							color: #374151;
							font-size: 1rem;
							margin-bottom: 0.5rem;
						}
						.ticket-print-bottom {
							display: flex;
							justify-content: space-between;
							align-items: flex-end;
							margin-top: 1.5rem;
						}
						.ticket-print-note {
							color: #9ca3af;
							font-size: 0.875rem;
						}
					</style>
				</head>
				<body>
					<div class="ticket-print-container">
						<div class="ticket-print-image">
							<img src="${ticket.image}" alt="${ticket.title}" />
						</div>
						<div class="ticket-print-details">
							<div>
								<div class="ticket-print-title">${ticket.title}</div>
								<div class="ticket-print-meta">${ticket.date} &middot; ${ticket.location}</div>
								<div class="ticket-print-user">Ticket for: <span style="font-weight:500">${
									ticket.user
								}</span></div>
								<div class="ticket-print-number">Ticket #${ticket.ticketNumber} of ${
			ticket.total
		}</div>
							</div>
							<div class="ticket-print-bottom">
								<div class="ticket-print-note">Present this QR code at the event entrance.</div>
								${ticket.qr || ""}
							</div>
						</div>
					</div>
				</body>
			</html>
		`);
		printWindow.document.close();
		printWindow.focus();
		printWindow.print();
		printWindow.close();
	};

	return (
		<div
			ref={ref}
			className="flex w-full max-w-2xl mx-auto my-6 border rounded-xl shadow-lg bg-white print:break-inside-avoid"
			style={{ minHeight: 220 }}
		>
			{/* Event image left */}
			<div className="relative rounded-l-xl overflow-hidden w-1/3 min-w-[120px] h-auto flex-shrink-0">
				<Image
					src={event.image}
					alt={event.title}
					fill
					className="object-cover"
					sizes="(max-width: 900px) 100vw, 300px"
					style={{ minHeight: 220 }}
				/>
			</div>
			{/* Details right */}
			<div className="flex-1 flex flex-col justify-between p-4 relative">
				<div>
					<h2 className="text-xl font-bold text-pink-600">{event.title}</h2>
					<div className="text-gray-700 text-sm mb-1">
						{event.date} &middot; {event.location}
					</div>
					<div className="text-gray-500 text-xs mb-1">
						Ticket for: <span className="font-medium">{user.name}</span>
					</div>
					<div className="text-gray-700 text-sm mb-1">
						Ticket #{ticketIndex + 1} of {total}
					</div>
				</div>
				<div className="flex items-end justify-between mt-4">
					<div className="text-xs text-gray-400">
						Present this QR code at the event entrance.
					</div>
					<div className="flex items-center gap-2">
						<QRCodeSVG
							id={`ticket-qr-${event.id}-${ticketIndex}`}
							value={JSON.stringify(ticketData)}
							size={80}
							bgColor="#fff"
							fgColor="#000"
							level="M"
							includeMargin={true}
						/>
						<Button
							onClick={handlePrint}
							className="absolute top-2 right-2 ml-2 text-pink-600 border-pink-600 hover:text-pink-600 hover:bg-pink-100 px-2 py-2 text-xs print:hidden"
							type="button"
							size={"sm"}
							variant="outline"
						>
							Download
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
