"use client";
import AuthForm from "@/components/auth-form";
import { useUser } from "@/lib/user-role";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { toast } from "sonner";

export default function SignupPage() {
	const { login } = useUser();
	const router = useRouter();
	const searchParams = useSearchParams();
	const referrer = searchParams.get("ref") || "/";

	const handleAuth = async (email: string, password: string, name?: string) => {
		const mod = await import("@/lib/data.json");
		const data = mod.default || mod;
		if (data.users.some((u: { email: string }) => u.email === email)) {
			toast.error("Email already exists. Please use a different email.");
			return;
		}
		if (!name || !name.trim()) {
			toast.error("Name is required.");
			return;
		}
		const id =
			"u-att-" +
			Math.random().toString(36).slice(2, 8) +
			Date.now().toString().slice(-4);
		const newUser = {
			id,
			name: name,
			email: email,
			password: password, // In production, hash the password!
			role: "attendee",
			tickets: [],
		};
		data.users.push(newUser);
		login({ id, name: newUser.name, email: newUser.email, role: "attendee" });
		toast.success(`Signup successful: welcome ${newUser.name}`);
		router.push(referrer);
	};

	return (
		<div
			className="auth-bg-container min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-pink-600"
			style={{ backgroundImage: `url("/bg auth.jpg")` }}
		>
			<div className="absolute inset-0 bg-black opacity-60 z-0" />
			<div className="relative z-10 w-full flex items-center justify-center px-8 ">
				<Suspense fallback={<p>Loading...</p>}>
					<AuthForm onSubmit={handleAuth} backgroundImageUrl="" />
				</Suspense>
			</div>
		</div>
	);
}
