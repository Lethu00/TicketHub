"use client";
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const promotedEvents = [
	{
		image: "/images/event1.jpg",
		title: "Summer Music Festival",
		subtitle: "Experience the best live music in the city!",
	},
	{
		image: "/images/event2.jpg",
		title: "Championship Finals",
		subtitle: "Don't miss the sports event of the year.",
	},
	{
		image: "/images/event3.jpg",
		title: "Tech Conference 2025",
		subtitle: "Innovate, network, and grow your career.",
	},
];

export default function Hero() {
	const [current, setCurrent] = React.useState(0);
	const [direction, setDirection] = React.useState<"left" | "right">("right");
	console.log("Current slide:", current, "Direction:", direction);

	const prev = () => {
		setDirection("left");
		setCurrent((c) => (c === 0 ? promotedEvents.length - 1 : c - 1));
	};
	const next = () => {
		setDirection("right");
		setCurrent((c) => (c === promotedEvents.length - 1 ? 0 : c + 1));
	};

	React.useEffect(() => {
		const timer = setInterval(next, 6000);
		return () => clearInterval(timer);
	}, [current]);

	return (
		<section className="flex justify-center my-5 md:my-6 md:mx-20 lg:mx-40 mx-4">
			<Card className="relative w-full rounded-xl overflow-hidden shadow-lg min-h-[160px] md:min-h-[240px] lg:min-h-[440px] py-0 -z-10 !isolate">
				<div className="relative flex h-[160px] md:h-[240px] lg:h-[440px]">
					{/* Text on the left, image on the right */}
					<div className="absolute z-2 flex flex-col justify-center w-full sm:w-[80%] h-full">
						<div className="absolute inset-0 left-0 bg-gradient-to-t from-black via-black/70 to-transparent sm:bg-gradient-to-r sm:from-black sm:via-black/70 sm:to-transparent pointer-events-none" />
						<div className="relative px-8 md:px-12 text-white flex flex-col lg:gap-2 h-full justify-end pb-4 md:pb-6 lg:pb-12 items-start">
							<h2 className="text-xl lg:text-4xl font-semibold drop-shadow text-left">
								{promotedEvents[current].title}
							</h2>
							<p className="text-md lg:text-xl font-light drop-shadow text-left">
								{promotedEvents[current].subtitle}
							</p>
						</div>
					</div>
					{/* Desktop image on the right */}
					<div className="hidden sm:block relative w-full h-full justify-centre ml-auto">
						<Image
							src={promotedEvents[current].image}
							alt={promotedEvents[current].title}
							fill
							className="object-cover bg-pink-600"
							priority
							sizes="(max-width: 900px) 50vw, 900px"
						/>
					</div>
					{/* On mobile, show image as background behind text */}
					<div className="absolute inset-0 -z-10 h-full w-full sm:hidden">
						<Image
							src={promotedEvents[current].image}
							alt={promotedEvents[current].title}
							fill
							className="object-cover bg-blue-600"
							priority
							sizes="100vw"
						/>
						<div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
					</div>
				</div>
				{/* Carousel Controls */}
				<Button
					variant="secondary"
					size="icon"
					className="hidden sm:block absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-black/70 text-white rounded-full p-2 z-20"
					onClick={prev}
					aria-label="Previous"
				>
					<ChevronLeft size={28} />
				</Button>
				<Button
					variant="secondary"
					size="icon"
					className="hidden sm:block absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 z-20"
					onClick={next}
					aria-label="Next"
				>
					<ChevronRight size={28} />
				</Button>
				{/* Dots */}
				<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
					{promotedEvents.map((_, idx) => (
						<Button
							key={idx}
							variant={idx === current ? "default" : "outline"}
							size="icon"
							className={`w-3 h-3 rounded-full p-0 border-2 ${
								idx === current
									? "bg-white border-white"
									: "bg-white/40 border-white/60"
							}`}
							onClick={() => {
								setDirection(idx > current ? "right" : "left");
								setCurrent(idx);
							}}
							aria-label={`Go to slide ${idx + 1}`}
						/>
					))}
				</div>
			</Card>
		</section>
	);
}
