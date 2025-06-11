"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export default function SearchBar({
	initialValue = "",
}: {
	initialValue?: string;
}) {
	const [search, setSearch] = useState(initialValue);
	const searchInputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (search.trim()) {
			router.push(`/search/${encodeURIComponent(search.trim())}`);
		}
	};

	return (
		<div className="flex-1 flex justify-center">
			<form
				className="relative w-full max-w-lg hidden md:block"
				onSubmit={handleSubmit}
			>
				<Input
					ref={searchInputRef}
					className="peer h-9 ps-9 pe-12 bg-white"
					placeholder="Search events, locations, dates..."
					type="search"
					value={search}
					onChange={handleSearch}
				/>
				<div className="absolute inset-y-0 left-0 flex items-center pl-2 text-muted-foreground/80 pointer-events-none">
					<SearchIcon size={18} />
				</div>
				<div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
					<kbd className="inline-flex h-5 items-center rounded border px-1 text-[0.7rem] font-medium text-muted-foreground/70">
						⌘K
					</kbd>
				</div>
			</form>
		</div>
	);
}
