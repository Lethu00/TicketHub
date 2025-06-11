"use client";
import AuthForm from "@/components/auth-form";
import { useUser } from "@/lib/user-role";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
	const { login } = useUser();
	const router = useRouter();
	const searchParams = useSearchParams();
	const referrer = searchParams.get("ref") || "/";

	const handleAuth = async (email: string, password: string) => {
		const mod = await import("@/lib/data.json");
		const data = mod.default || mod;
		const user = data.users.find(
			(u: {
				email: string;
				password: string;
				id: string;
				name: string;
				role: string;
			}) => u.email === email
		);
		if (!user) {
			toast.error("No user found with that email.");
			return;
		}
		if (user.password !== password) {
			toast.error("Incorrect password.");
			return;
		}
		login({
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role as "attendee",
		});
		toast.success(`Login successful: welcome ${user.name}`);
		if (user.role === "organiser") {
			router.push("/organiser");
		} else {
			router.push(referrer);
		}
	};

	return (
		<div
			className="auth-bg-container min-h-screen w-full  flex items-center justify-center bg-cover bg-center bg-pink-600 relative"
			style={{ backgroundImage: `url("/bg auth.jpg")` }}
		>
			<div className="absolute inset-0 bg-black opacity-60 z-0" />
			<div className="relative z-10 w-full flex items-center justify-center p-8 ">
				<AuthForm onSubmit={handleAuth} backgroundImageUrl="" />
			</div>
		</div>
	);
}
