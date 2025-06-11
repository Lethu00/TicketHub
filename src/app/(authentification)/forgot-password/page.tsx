"use client";
import AuthForm from "@/components/auth-form";

const backgroundImageUrl = "/globe.svg";

export default function ForgotPasswordPage() {
	return (
		<div
			className="min-h-screen w-full flex items-center justify-center bg-cover bg-center"
			style={{ backgroundImage: `url(${backgroundImageUrl})` }}
		>
			<AuthForm onSubmit={() => {}} backgroundImageUrl="" />
		</div>
	);
}
