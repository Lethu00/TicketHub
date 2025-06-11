"use client";
import AuthForm from "@/components/auth-form";
import { Suspense } from "react";

const backgroundImageUrl = "/globe.svg";

function ForgotPasswordPageInner() {
	return (
		<div
			className="min-h-screen w-full flex items-center justify-center bg-cover bg-center"
			style={{ backgroundImage: `url(${backgroundImageUrl})` }}
		>
			<AuthForm onSubmit={() => {}} backgroundImageUrl="" />
		</div>
	);
}

export default function ForgotPasswordPage() {
	return (
		<Suspense fallback={<p>Loading...</p>}>
			<ForgotPasswordPageInner />
		</Suspense>
	);
}
