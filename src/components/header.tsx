"use client";
import React, { useState } from "react";
import {
	Ticket,
	User,
	LogOut,
	ChevronDown,
	PlusCircle,
	HelpCircle,
	Menu,
	LayoutDashboard,
	CalendarCheck2,
} from "lucide-react";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useUser } from "@/lib/user-role";
import { useRouter } from "next/navigation";
import SearchBar from "./search-bar";

const categories = [
	{ label: "Music", href: "/events?cat=music" },
	{ label: "Sports", href: "/events?cat=sports" },
	{ label: "Conferences", href: "/events?cat=conferences" },
	{ label: "Festivals", href: "/events?cat=festivals" },
	{ label: "Theatre", href: "/events?cat=theatre" },
	{ label: "Online Events", href: "/events?cat=online" },
];

export default function Header() {
	const { user, logout } = useUser();
	const isLoggedIn = !!user;
	const isUser = user?.role === "attendee";
	const isOrganizer = user?.role === "organiser";
	const router = useRouter();
	const [categoriesOpen, setCategoriesOpen] = useState(false);
	const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

	const handleCategory = (cat: string) => {
		router.push(`/search/${encodeURIComponent(cat)}`);
		setCategoriesOpen(false);
		setMobileCategoriesOpen(false);
	};

	// Navigation for each role
	const navLinks = (() => {
		if (isOrganizer) {
			return [
				{
					label: "Dashboard",
					href: "/organiser/dashboard",
					icon: <LayoutDashboard className="inline w-4 h-4 mr-1" />,
				},
				{
					label: "My Events",
					href: "/organiser/my-events",
					icon: <CalendarCheck2 className="inline w-4 h-4 mr-1" />,
				},
				{
					label: "Create Event",
					href: "/organiser/event-create",
					icon: <PlusCircle className="inline w-4 h-4 mr-1" />,
				},
			];
		}
		if (isUser) {
			return [
				{
					label: "Events",
					href: "/events",
				},
				{
					label: "Categories",
					dropdown: true,
				},

				{
					label: "About Us",
					href: "/about",
				},
			];
		}
		// Not logged in
		return [
			{
				label: "Events",
				href: "/events",
			},
			{
				label: "Categories",
				dropdown: true,
			},
			{
				label: "About Us",
				href: "/about",
			},
			{
				label: "Login",
				href: "/login",
			},
		];
	})();

	const userDropdownLinks = [
		...(isOrganizer
			? [
					{
						label: "Dashboard",
						href: "/organizer/dashboard",
						icon: <LayoutDashboard className="inline w-4 h-4 mr-1" />,
					},
					{
						label: "My Events",
						href: "/organizer/my-events",
						icon: <CalendarCheck2 className="inline w-4 h-4 mr-1" />,
					},
					{
						label: "Create Event",
						href: "/organizer/event-create",
						icon: <PlusCircle className="inline w-4 h-4 mr-1" />,
					},
			  ]
			: []),
		...(isUser
			? [
					{
						label: "My Tickets",
						href: "/my-tickets",
						icon: <Ticket className="inline w-4 h-4 mr-1" />,
					},
			  ]
			: []),
		{
			label: "My Account",
			href: "/account",
			icon: <User className="inline w-4 h-4 mr-1" />,
		},
		{
			label: "Logout",
			href: "#",
			icon: <LogOut className="inline w-4 h-4 mr-1" />,
			onClick: () => {
				logout();
				router.push("/");
			},
		},
	];

	return (
		<header className="px-4 md:px-6 bg-pink-600 backdrop-blur shadow-sm sticky top-0 z-50">
			<div className="flex h-16 items-center justify-between gap-4 relative">
				{/* Logo */}
				<Link
					href={isOrganizer ? "/organiser/" : "/"}
					className="flex items-center text-primary hover:text-primary/90"
				>
					<Logo className="text-white" />
					<span className="ml-2 text-lg text-white font-bold md:block">
						TicketHub
					</span>
				</Link>
				<SearchBar initialValue="" />

				{/* Desktop Nav & Icons */}
				<div className="hidden md:flex items-center gap-2">
					<NavigationMenu>
						<NavigationMenuList className="gap-2 text-white">
							{navLinks.map((link, idx) =>
								link.dropdown ? (
									<NavigationMenuItem key={idx} className="relative">
										<Button
											variant="ghost"
											className="flex items-center gap-1 text-white hover:text-primary py-1.5 font-medium"
											onClick={() => setCategoriesOpen((v) => !v)}
											type="button"
										>
											Categories <ChevronDown className="w-4 h-4" />
										</Button>
										{categoriesOpen && (
											<div className="absolute left-0 mt-2 w-48 bg-white border rounded shadow z-50">
												{categories.map((cat) => (
													<button
														key={cat.label}
														className="relative block px-4 py-2 hover:bg-muted text-sm w-full text-black text-left"
														onClick={() => handleCategory(cat.label)}
														type="button"
													>
														{cat.label}
													</button>
												))}
											</div>
										)}
									</NavigationMenuItem>
								) : (
									<NavigationMenuItem key={idx}>
										{link.label === "Create Event" ? (
											<NavigationMenuLink
												href={link.href}
												className="flex flex-row items-center gap-2 border-2 border-white text-white font-bold bg-pink-600 px-3 py-2 rounded-lg transition-colors hover:bg-white hover:text-pink-600 group lg:mr-2"
												style={{ boxSizing: "border-box" }}
											>
												{/* Icon is white by default, pink when parent is hovered */}
												{React.cloneElement(link.icon, {
													className:
														"w-5 h-5 text-white group-hover:text-pink-600 transition-colors",
												})}
												{link.label}
											</NavigationMenuLink>
										) : (
											<NavigationMenuLink
												href={link.href}
												className="flex flex-row items-center gap-2  hover:bg-pink-700 text-white px-6 py-2 font-medium"
											>
												{/* White icon */}
												{link.icon &&
													React.cloneElement(link.icon, {
														className: "w-5 h-5 text-white",
													})}
												{link.label}
											</NavigationMenuLink>
										)}
									</NavigationMenuItem>
								)
							)}
						</NavigationMenuList>
					</NavigationMenu>
					{/* Icons for user */}
					<div className="flex items-center gap-2">
						{/* Help/FAQ icon for user only */}
						{isUser && (
							<Button
								variant="ghost"
								size="icon"
								aria-label="Help"
								className="text-white"
							>
								<HelpCircle />
							</Button>
						)}
						{/* User/account dropdown */}
						{isLoggedIn && (
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										aria-label="Account menu"
										className="text-pink-600 border rounded-full bg-white"
									>
										<User />
									</Button>
								</PopoverTrigger>
								<PopoverContent align="end" className="w-44 p-2">
									<nav className="flex flex-col gap-1">
										{userDropdownLinks.map((link, i) =>
											link.onClick ? (
												<button
													key={i}
													className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted w-full text-left"
													onClick={link.onClick}
												>
													{link.icon}
													{link.label}
												</button>
											) : (
												<Link
													key={i}
													href={link.href!}
													className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted"
												>
													{link.icon}
													{link.label}
												</Link>
											)
										)}
									</nav>
								</PopoverContent>
							</Popover>
						)}
					</div>
				</div>

				{/* Mobile: DropdownMenu on right */}
				<div className="flex md:hidden items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" aria-label="Open menu">
								<Menu />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-64">
							{navLinks.map((link, idx) =>
								link.dropdown ? (
									<div key={idx}>
										<DropdownMenuItem
											asChild
											onSelect={(e) => e.preventDefault()} // Prevents closing
										>
											<span
												className="flex items-center gap-2 cursor-pointer"
												onClick={() => setMobileCategoriesOpen((v) => !v)}
											>
												Categories <ChevronDown className="w-4 h-4" />
											</span>
										</DropdownMenuItem>
										{mobileCategoriesOpen &&
											categories.map((cat) => (
												<DropdownMenuItem asChild key={cat.label}>
													<button
														className="pl-6 text-sm w-full text-left"
														onClick={() => handleCategory(cat.label)}
														type="button"
													>
														{cat.label}
													</button>
												</DropdownMenuItem>
											))}
									</div>
								) : (
									<DropdownMenuItem asChild key={idx}>
										<Link
											href={link.href!}
											className={`flex items-center gap-2 ${
												link.label === "Login"
													? "bg-pink-600 py-2 px-4 text-white hover:bg-pink-700"
													: ""
											}`}
										>
											{link.icon}
											<span className="md:hidden">{link.label}</span>
										</Link>
									</DropdownMenuItem>
								)
							)}
							<DropdownMenuSeparator />
							{/* User/Organizer dropdown links */}
							{isLoggedIn &&
								userDropdownLinks.map((link, i) =>
									link.onClick ? (
										<DropdownMenuItem
											key={i}
											onClick={link.onClick}
											className="flex items-center gap-2"
										>
											{link.icon}
											<span className="md:hidden">{link.label}</span>
										</DropdownMenuItem>
									) : (
										<DropdownMenuItem asChild key={i}>
											<Link
												href={link.href!}
												className="flex items-center gap-2"
											>
												{link.icon}
												<span className="md:hidden">{link.label}</span>
											</Link>
										</DropdownMenuItem>
									)
								)}
							{/* Cart, Notification, Help icons for user */}
							{isUser && (
								<>
									<DropdownMenuItem>
										<HelpCircle className="mr-2" />
										<span className="md:hidden">Help</span>
									</DropdownMenuItem>
								</>
							)}
							{/* FAQ icon for not logged in */}
							{!isLoggedIn && (
								<DropdownMenuItem>
									<HelpCircle className="mr-2" />
									<span className="md:hidden">Help</span>
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			{/* Optionally, render filteredEvents as a dropdown or in a results section below the search bar */}
		</header>
	);
}
