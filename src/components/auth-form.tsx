"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
// import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Logo from "@/components/logo";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AuthFormProps {
	onSubmit: (
		email: string,
		password: string,
		// mode: "login" | "signup",
		name?: string,
		organisationName?: string
	) => void;
	backgroundImageUrl: string;
	// initialMode?: "login" | "signup" | "forgot";
	role?: "attendee" | "organiser";
}

const AuthForm: React.FC<AuthFormProps> = ({
	onSubmit,
	backgroundImageUrl,
	// initialMode = "login",
	role = "attendee",
}) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [forgotMode, setForgotMode] = useState(false);
	const [forgotEmail, setForgotEmail] = useState("");
	const [forgotMessage, setForgotMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [pageLoading, setPageLoading] = useState(false);
	const [name, setName] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [organisationName, setOrganisationName] = useState("");
	const pathname = usePathname();
	const mode = pathname.includes("sign-up") ? "signup" : "login";

	// Add effect for route change loader
	React.useEffect(() => {
		const handleStart = () => setPageLoading(true);
		const handleComplete = () => setPageLoading(false);
		// Listen to route change events
		window.addEventListener("next-route-change-start", handleStart);
		window.addEventListener("next-route-change-complete", handleComplete);
		return () => {
			window.removeEventListener("next-route-change-start", handleStart);
			window.removeEventListener("next-route-change-complete", handleComplete);
		};
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		if (mode === "signup") {
			if (role === "organiser" && !organisationName.trim()) {
				setError("Organisation name is required.");
				setLoading(false);
				return;
			}
			if (!name.trim()) {
				setError("Name is required.");
				setLoading(false);
				return;
			}
			if (password !== confirmPassword) {
				setError("Passwords do not match.");
				setLoading(false);
				return;
			}
		}
		try {
			if (mode === "signup") {
				if (role === "organiser") {
					await onSubmit(email, password, name, organisationName);
				} else {
					await onSubmit(email, password, name);
				}
			} else {
				await onSubmit(email, password);
			}
		} catch (err) {
			setError((err as Error)?.message || "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	const handleForgotSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!forgotEmail.trim()) {
			setForgotMessage("Please enter your email.");
			return;
		}
		// Simulate sending reset link
		setForgotMessage(
			"If an account with that email exists, a reset link has been sent."
		);
	};

	return (
		<div
			key={pathname}
			className="auth-bg-container"
			style={{
				minHeight: "100vh",
				width: "100vw",
				backgroundImage: `url(${backgroundImageUrl})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Card className="w-full max-w-md px-3 py-8 bg-white/90 rounded-xl shadow-lg relative">
				{pageLoading && (
					<div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-50">
						<Logo className="w-16 h-16 animate-pulse mb-4" />
						<Loader2 className="animate-spin w-8 h-8 text-pink-600" />
					</div>
				)}
				<CardHeader>
					<div className="flex flex-col items-center justify-center">
						<div className="mb-4 flex items-center">
							<Logo className="-mr-4 w-14 h-14 " />
							<span className="font-bold text-xl -mt-5 text-pink-600">
								TicketHub
							</span>
						</div>
						<CardTitle className="text-center text-2xl font-bold">
							{mode === "login"
								? "Login"
								: role === "organiser"
								? "Organiser Sign Up"
								: "Sign Up"}
						</CardTitle>
					</div>
				</CardHeader>
				<CardContent>
					{forgotMode ? (
						<form className="flex flex-col gap-5" onSubmit={handleForgotSubmit}>
							<div className="flex flex-col gap-1">
								<label
									htmlFor="forgotEmail"
									className="text-sm font-medium text-gray-700"
								>
									Email
								</label>
								<Input
									id="forgotEmail"
									type="email"
									placeholder="Enter your email"
									value={forgotEmail}
									onChange={(e) => setForgotEmail(e.target.value)}
									required
									className="bg-primary-foreground"
								/>
							</div>
							{forgotMessage && (
								<div className="text-green-600 text-sm text-center">
									{forgotMessage}
								</div>
							)}
							<Button type="submit" className="w-full mt-2">
								Send Reset Link
							</Button>
							<Button
								type="button"
								variant="link"
								className="w-full mt-0"
								onClick={() => {
									setForgotMode(false);
									setForgotMessage("");
								}}
							>
								Back to Login
							</Button>
						</form>
					) : (
						<form className="flex flex-col gap-5" onSubmit={handleSubmit}>
							{mode === "signup" && (
								<div className="flex flex-col gap-1">
									<label
										htmlFor="name"
										className="text-sm font-medium text-gray-700"
									>
										Name
									</label>
									<Input
										id="name"
										type="text"
										placeholder="Name"
										value={name}
										onChange={(e) => setName(e.target.value)}
										required={mode === "signup"}
										className="bg-primary-foreground"
									/>
								</div>
							)}
							{mode === "signup" && role === "organiser" && (
								<div className="flex flex-col gap-1">
									<label
										htmlFor="organisationName"
										className="text-sm font-medium text-gray-700"
									>
										Organisation Name
									</label>
									<Input
										id="organisationName"
										type="text"
										placeholder="Organisation Name"
										value={organisationName}
										onChange={(e) => setOrganisationName(e.target.value)}
										required={mode === "signup" && role === "organiser"}
										className="bg-primary-foreground"
									/>
								</div>
							)}
							<div className="flex flex-col gap-1">
								<label
									htmlFor="email"
									className="text-sm font-medium text-gray-700"
								>
									Email
								</label>
								<Input
									id="email"
									type="email"
									placeholder="Email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className="bg-primary-foreground"
								/>
							</div>
							<div className="flex flex-col gap-1 relative">
								<label
									htmlFor="password"
									className="text-sm font-medium text-gray-700"
								>
									Password
								</label>
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="Password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									className="pr-10 bg-primary-foreground"
								/>
								<button
									type="button"
									className="absolute right-3 top-8 text-gray-500 hover:text-gray-700 focus:outline-none"
									onClick={() => setShowPassword((prev) => !prev)}
									aria-label={showPassword ? "Hide password" : "Show password"}
								>
									{showPassword ? (
										<EyeOff className="w-5 h-5" />
									) : (
										<Eye className="w-5 h-5" />
									)}
								</button>
							</div>
							{mode === "signup" && (
								<div className="flex flex-col gap-1 relative">
									<label
										htmlFor="confirmPassword"
										className="text-sm font-medium text-gray-700"
									>
										Confirm Password
									</label>
									<Input
										id="confirmPassword"
										type={showPassword ? "text" : "password"}
										placeholder="Confirm Password"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										required={mode === "signup"}
										className="pr-10 bg-primary-foreground"
									/>
									<button
										type="button"
										className="absolute right-3 top-8 text-gray-500 hover:text-gray-700 focus:outline-none"
										onClick={() => setShowPassword((prev) => !prev)}
										aria-label={
											showPassword ? "Hide password" : "Show password"
										}
									>
										{showPassword ? (
											<EyeOff className="w-5 h-5" />
										) : (
											<Eye className="w-5 h-5" />
										)}
									</button>
								</div>
							)}
							{error && (
								<div className="text-red-500 text-sm text-center">{error}</div>
							)}
							<Button
								type="submit"
								className="w-full mt-2 bg-pink-600 hover:bg-pink-700 text-white"
								disabled={loading || pageLoading}
							>
								{loading ? (
									<Loader2 className="animate-spin w-5 h-5 mx-auto" />
								) : mode === "signup" ? (
									"Sign Up"
								) : (
									"Login"
								)}
							</Button>
							<div className="flex flex-col items-center gap-1 mt-2">
								{!forgotMode && (
									<Link
										href="/forgot-password"
										className="p-0 h-auto text-xs font-medium hover:underline mb-1"
									>
										Forgot password?
									</Link>
								)}
								{!forgotMode && (
									<div>
										{mode === "signup" ? (
											<div className="flex flex-col items-center">
												{/* Sign in link */}
												<div>
													<span className="text-xs text-gray-500">
														Already have an account?{" "}
													</span>
													<Link
														href="/login"
														className="p-0 h-auto text-xs font-medium hover:underline"
													>
														Login
													</Link>
												</div>
												{/* Sign up as organiser link */}
												<div className="">
													<span className="text-xs text-gray-500">
														Want to host events?{" "}
													</span>
													<Link
														href="/sign-up-organiser?role=organiser"
														className="p-0 h-auto text-xs font-medium hover:underline text-pink-600"
													>
														Sign up as an organiser
													</Link>
												</div>
											</div>
										) : (
											<>
												<span className="text-xs text-gray-500">
													{"Don't have an account? "}
												</span>
												<Link
													href="/sign-up"
													className="p-0 h-auto text-xs font-medium hover:underline"
												>
													Sign Up
												</Link>
											</>
										)}
									</div>
								)}
							</div>
						</form>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default AuthForm;
