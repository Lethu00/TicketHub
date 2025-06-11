import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/lib/user-role";
import "./globals.css";

const _geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const _geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "TicketHub",
	description: "Your one-stop solution for event ticketing",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<UserProvider>
					{/* Pass the role as a prop or via context */}
					{children}
					<Toaster />
				</UserProvider>
			</body>
		</html>
	);
}
