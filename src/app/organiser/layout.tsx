"use client";
import FooterOrg from "@/components/footer-org";
import Header from "@/components/header";
import React from "react";

export default function OrganiserLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div>
			<Header />
			<main>{children}</main>
			<FooterOrg />
		</div>
	);
}
