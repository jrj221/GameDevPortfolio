export default function BudgetAppPrivacyPolicy() {
	return (
		<main className="min-h-screen bg-[#0b0b0c] text-white px-6 py-24 flex items-center justify-center">
			<div className="w-full max-w-3xl space-y-16">
				{/* Header */}
				<header className="space-y-4">
					<h1 className="text-5xl md:text-6xl font-light tracking-tight">Privacy Policy</h1>
					<p className="text-sm text-white/60">Last updated: May 23, 2026</p>
				</header>

				{/* Body */}
				<section className="space-y-10 text-white/80 leading-relaxed text-base md:text-lg">
					<p>
						This website respects your privacy. We do not collect any information. All data used in the app
						stays on the user's device and is not transmitted to any external servers.
					</p>

					<div className="space-y-2">
						<h2 className="text-xl font-light text-white">Information We Collect</h2>
						<p>This app does not collect, store, or share any personal data.</p>
					</div>

					<div className="space-y-2">
						<h2 className="text-xl font-light text-white">Cookies</h2>
						<p>This app does not use cookies.</p>
					</div>

					<div className="space-y-2">
						<h2 className="text-xl font-light text-white">Third-Party Services</h2>
						<p>
							This app does not use analytics, tracking tools, or third-party services that collect user
							data.
						</p>
					</div>

					<div className="space-y-2">
						<h2 className="text-xl font-light text-white">Data Security</h2>
						<p>
							All data used in the app stays on the user's device and is not transmitted to any external
							servers.
						</p>
					</div>

					<div className="space-y-2">
						<h2 className="text-xl font-light text-white">Contact</h2>
						<p>
							If you have questions about this Privacy Policy, you can contact us at{" "}
							<a
								href="mailto:jrj.portfoliocontactform@gmail.com"
								className="underline underline-offset-4 text-white/90 hover:text-white transition"
							>
								jrj.portfoliocontactform@gmail.com
							</a>
						</p>
					</div>
				</section>
			</div>
		</main>
	);
}
