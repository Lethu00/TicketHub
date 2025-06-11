"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type User = {
	id: string;
	name: string;
	email: string;
	role: "organiser" | "attendee" | "none";
};

type UserContextType = {
	user: User | null;
	login: (user: User) => void;
	logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const SESSION_KEY = "eventhub_session";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 1 day in ms

export function UserProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const router = useRouter();

	// Load session from localStorage
	useEffect(() => {
		const session = localStorage.getItem(SESSION_KEY);
		if (session) {
			const { user, expires } = JSON.parse(session);
			if (Date.now() < expires) {
				setUser(user);
			} else {
				localStorage.removeItem(SESSION_KEY);
			}
		}
	}, []);

	// Login: set user and session expiry
	const login = (user: User) => {
		setUser(user);
		localStorage.setItem(
			SESSION_KEY,
			JSON.stringify({ user, expires: Date.now() + SESSION_DURATION })
		);
	};

	// Logout: clear user and session
	const logout = () => {
		setUser(null);
		localStorage.removeItem(SESSION_KEY);
		router.push("/");
	};

	return (
		<UserContext.Provider value={{ user, login, logout }}>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	const ctx = useContext(UserContext);
	if (!ctx) throw new Error("useUser must be used within a UserProvider");
	return ctx;
}
