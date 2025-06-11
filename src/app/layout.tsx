import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/lib/user-role";
import "./globals.css";

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
