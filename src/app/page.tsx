import Link from "next/link";

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
			<div className="container mx-auto px-4 py-16">
				<main className="flex flex-col items-center justify-center text-center">
					{/* Header Section */}
					<div className="mb-12">
						<h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
							Wulang ChatWA
						</h1>
						<p className="text-lg text-gray-600 dark:text-gray-300">
							Sistem Manajemen Member WhatsApp
						</p>
					</div>

					{/* Main Action */}
					<div className="max-w-4xl w-full">
						<Link
							href="/member"
							className="group relative rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 block"
						>
							<h2 className="mb-3 text-2xl font-semibold text-gray-800 dark:text-white">
								Manajemen Member{" "}
								<span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
									→
								</span>
							</h2>
							<p className="text-sm opacity-60">
								Kelola status member, durasi langganan, dan informasi member.
							</p>
						</Link>
					</div>

					{/* Description Section */}
					<div className="mt-16 max-w-3xl text-center">
						<div className="rounded-xl p-8 text-gray-800 dark:text-white">
							<h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
								Tentang Wulang ChatWA
							</h2>
							<p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
								Wulang Chat-WA adalah asisten penelitian 24/7 yang hadir di
								WhatsApp Anda, siap membantu brainstorming ide penelitian,
								seperti memiliki customer service pribadi untuk karya ilmiah
								Anda.
							</p>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
