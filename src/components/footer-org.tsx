import Logo from "@/components/logo";
import Link from "next/link";

// NOTE: To ensure the footer is always at the bottom, the parent layout/page should have 'flex flex-col min-h-screen'.
export default function FooterOrg() {
	return (
		<footer className="w-full bg-gray-900 text-white border-t border-gray-800 mt-auto">
			<div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
				<div className="flex flex-col items-center md:items-start gap-2">
					<Logo />
					<span className="text-lg font-bold tracking-tight">TicketHub</span>
					<span className="text-xs text-gray-400">
						Your gateway to unforgettable events
					</span>
				</div>
				<nav className="flex flex-col md:flex-row gap-4 md:gap-8 text-sm items-center">
					<Link href="/organiser" className="hover:text-pink-400 transition">
						My Events
					</Link>
					<Link href="/events" className="hover:text-pink-400 transition">
						Dashboard
					</Link>
					<Link href="/contact" className="hover:text-pink-400 transition">
						Contact
					</Link>
					<Link href="/login" className="hover:text-pink-400 transition">
						Login as Attendee
					</Link>
					<Link href="/help" className="hover:text-pink-400 transition">
						Need Help?
					</Link>
				</nav>
				<div className="flex gap-4 items-center">
					<a
						href="#"
						aria-label="Twitter"
						className="hover:text-pink-400 transition"
					>
						<svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
							<path d="M22.46 5.92c-.8.36-1.67.6-2.58.71a4.48 4.48 0 0 0 1.97-2.48 8.93 8.93 0 0 1-2.83 1.08A4.48 4.48 0 0 0 16.11 4c-2.48 0-4.5 2.01-4.5 4.5 0 .35.04.7.11 1.03C7.69 9.36 4.07 7.6 1.64 4.93c-.38.65-.6 1.4-.6 2.2 0 1.52.77 2.86 1.95 3.65-.72-.02-1.4-.22-1.99-.55v.06c0 2.13 1.52 3.91 3.54 4.31-.37.1-.76.16-1.16.16-.28 0-.55-.03-.81-.08.55 1.7 2.16 2.94 4.07 2.97A9.01 9.01 0 0 1 2 19.54c-.29 0-.57-.02-.85-.05A12.77 12.77 0 0 0 8.29 21.5c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54.8-.58 1.5-1.3 2.05-2.12z" />
						</svg>
					</a>
					<a
						href="#"
						aria-label="Instagram"
						className="hover:text-pink-400 transition"
					>
						<svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
							<path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 2.25a6.25 6.25 0 1 1 0 12.5 6.25 6.25 0 0 1 0-12.5zm0 1.5a4.75 4.75 0 1 0 0 9.5 4.75 4.75 0 0 0 0-9.5zm6.13 1.12a1.13 1.13 0 1 1-2.25 0 1.13 1.13 0 0 1 2.25 0z" />
						</svg>
					</a>
					<a
						href="#"
						aria-label="Facebook"
						className="hover:text-pink-400 transition"
					>
						<svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
							<path d="M17.525 8.998h-2.02V7.498c0-.465.308-.573.525-.573h1.465V4.5h-2.01c-2.21 0-2.715 1.66-2.715 2.715v1.783h-1.5v2.5h1.5v6.5h3v-6.5h1.5l.5-2.5z" />
						</svg>
					</a>
				</div>
			</div>
			<div className="text-center text-xs text-gray-500 py-4 border-t border-gray-800 bg-gray-950">
				&copy; {new Date().getFullYear()} Event Hub. All rights reserved.
			</div>
		</footer>
	);
}
