export default function SandCollapsePrivacyPolicy() {
	return (
		<main className="min-h-screen bg-[#0b0b0c] text-white px-6 py-24 flex items-center justify-center">
			<div className="w-full max-w-3xl space-y-16">
				{/* Header */}
				<header className="space-y-4">
					<h1 className="text-5xl md:text-6xl font-light tracking-tight">Privacy Policy</h1>
					<p className="text-sm text-white/60">Last updated: November 5, 2026</p>
				</header>

				{/* Body */}
				<section className="space-y-10 text-white/80 leading-relaxed text-base md:text-lg">
					<p>
						This website respects your privacy. We, the developers, do not collect any information. Game
						data stays on the user's device, except for optional Apple Game Center features described below.
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
						<h2 className="text-xl font-light text-white">Game Center</h2>
						<p>
							This app integrates with Apple Game Center. If you are signed in to Game Center, certain
							information, such as your scores and level, is sent to Game Center and handled by Apple
							according to{" "}
							<a
								href="https://www.apple.com/legal/privacy/"
								className="underline underline-offset-4 text-white/90 hover:text-white transition"
							>
								Apple's Privacy Policy
							</a>
							. This information is not transferred to or accessible by the developers. Game Center is
							optional: if you are signed out of Game Center, the app works fully without it and no
							information is sent.
						</p>
					</div>

					<div className="space-y-2">
						<h2 className="text-xl font-light text-white">Third-Party Services</h2>
						<p>
							Apart from Apple Game Center, this app does not use analytics, tracking tools, or
							third-party services that collect user data.
						</p>
					</div>

					<div className="space-y-2">
						<h2 className="text-xl font-light text-white">Data Security</h2>
						<p>
							Game data stays on the user's device. The only data transmitted off the device is what is
							sent to Apple Game Center when you choose to be signed in to it.
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
