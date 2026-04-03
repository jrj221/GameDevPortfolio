import { useState, ReactNode } from "react";
import GameDevProjectCard from "./GameDevProjectCard";

export interface Project {
	title: string;
	description: ReactNode;
	features: string[];
	tags: string[];
	githubLink?: string;
	playLink?: string;
	images: string[];
}

const projects: Project[] = [
	{
		title: "Building Busters",
		description: (
			<div className="project-description-html">
				<h3 style={{ textAlign: "center" }}>Project Overview</h3>
				<p>
					I participated in Jerbob’s Silly Game Jam, where the theme was “Go to Town.” After several hours of
					brainstorming, our team settled on a playful concept: a once‑peaceful town where every building has
					come alive as a monster. Players control Jerome, a construction worker who must calm each building
					by throwing the correct furniture back at it, restoring order one structure at a time.
				</p>

				<h3 style={{ textAlign: "center" }}>Team Collaboration and Decision-Making</h3>
				<p>
					This was my first time working on a game development team rather than building solo projects. Early
					on, we had disagreements about whether the idea was feasible and fun. We worked through those
					concerns by openly discussing pros and cons, sharing perspectives, and ultimately voting on the
					direction. That process taught me how valuable communication is when aligning a team around a shared
					vision.
				</p>
				<p>
					Throughout development, we occasionally struggled with unspoken assumptions—different team members
					sometimes imagined mechanics or features differently. Those moments highlighted the importance of
					explicit communication,{" "}
					<a
						href="/media/PDF/BuildingBusters-GDD.pdf"
						target="_blank"
						style={{ color: "var(--color-text-muted)", textDecoration: "underline" }}
					>
						documentation
					</a>
					, and confirming understanding before implementing features.
				</p>

				<h3 style={{ textAlign: "center" }}>Technical Contributions</h3>
				<p>
					I served as one of two programmers on the team. My main responsibilities included:
					<br />• Character movement and camera control for Jerome
					<br />• Animator setup, including wiring prefabs to their state machines
					<br />• Bug fixing across gameplay and scene logic
					<br />• Level assembly, where I built the final environment using prefabs created by the team
				</p>
				<p>
					Working alongside a more experienced developer pushed me to improve quickly. Some of my work was
					reworked or optimized, which was humbling at times, but I treated it as an opportunity to learn
					better architectural patterns, cleaner code practices, and more scalable approaches to Unity
					development.
				</p>

				<h3 style={{ textAlign: "center" }}>Personal Growth</h3>
				<p>
					This project was a major step in my development as a game programmer. I learned how to:
					<br />• Communicate effectively within a team
					<br />• Break down tasks and coordinate responsibilities
					<br />• Accept and integrate feedback from more experienced teammates
					<br />• Apply new architectural patterns and Unity workflows
					<br />• Balance speed with maintainability in a jam environment
					<br />
					The experience strengthened both my technical skills and my ability to collaborate under time
					pressure.
				</p>
			</div>
		),
		features: ["Team Collaboration", "Top-down Cursor Rotation", "Level Assembly"],
		tags: ["Unity", "Game Jam", "Team"],
		playLink: "https://zearoh.itch.io/buildingbusters",
		images: [
			"media/BuildingBusters/building_busters_0.png",
			"media/BuildingBusters/building_busters_1.png",
			"media/BuildingBusters/building_busters_2.png",
			"media/BuildingBusters/building_busters_3.png",
			"media/BuildingBusters/building_busters_4.png",
			"media/BuildingBusters/building_busters_gameplay.mp4",
		],
	},
	{
		title: "Bank Escape!",
		description: (
			<div className="project-description-html">
				<h3 style={{ textAlign: "center" }}>Project Overview</h3>
				<p>
					I built a physics-based character controller in Unity from scratch, which I chose specifically
					because it would force me to touch a wide range of systems — physics, input, UI, state management,
					and level design — in a single project. It took over 100 hours from start to finish. The final
					project was wrapped in a game set in a laser-filled bank vault to show off the platforming abilities
					of the controller.
				</p>

				<h3 style={{ textAlign: "center" }}>Technical Growth</h3>
				<p>
					Early on I made the mistake of directly overwriting velocity to move the player, which constantly
					fought Unity's built-in physics systems and created unpredictable behavior. Switching to a
					force-based approach taught me a fundamental lesson: understand the tools you're working with before
					trying to override them. Unity's physics engine is powerful, and working with it rather than against
					it made everything more stable and predictable.
				</p>
				<p>
					My codebase grew from a single 1,000 line file to nearly 20 files as I learned about code
					organization on my own and in my college classes at the time. The biggest architectural shift was
					rewriting the entire movement system into a state machine, where each movement state — Grounded,
					Airborne, Wallrun, Slide, and others — became its own class inheriting from a shared interface.
					Before this refactor, debugging was painful because data and logic were tangled together. After,
					each state was isolated and testable on its own. This is the change I'm most proud of technically
					and plan on using for future projects.
				</p>
				<p>
					Other challenges included detecting and moving smoothly along slopes and stairs, smoothing the
					camera movement when bumbling up/down stairs, as well as buffering jump input so that if a player’s
					reflexes are slightly off, they aren’t completely penalized.
				</p>

				<h3 style={{ textAlign: "center" }}>Scope Management</h3>
				<p>
					I fell into scope creep several times, and had to develop a deliberate process to keep myself on
					track. Before adding any feature I started asking: does this fit my current skill level? Does it
					serve the core goal of the project — a character controller — or is it extra fluff? This helped me
					ship. When it came time to wrap the controller in a simple level, I intentionally constrained myself
					to a bank vault platformer rather than a full game, because building a full game would have
					prevented me from moving on to other learning experiences. As one of my wise professors once said,
					“there’s a time to keep improving and getting better, and there’s a time to stop and move on to
					other things.”
				</p>

				<h3 style={{ textAlign: "center" }}>Iteration and Polish</h3>
				<p>
					I tried to follow a deliberate iteration process: get a feature working, polish it, move to the next
					feature, and come back to polish again. I was conscious of not being a perfectionist, but I was
					always looking for ways to make the controls feel just a little smoother. The end result is a
					controller I'm genuinely happy with — the state transitions feel clean and the movement feels
					responsive.
				</p>

				<h3 style={{ textAlign: "center" }}>Persistence and Problem Solving</h3>
				<p>
					Several features pushed me to the edge of giving up — jump buffering alone took multiple sessions,
					was abandoned, and eventually solved. Wallrun gravity broke in a way I couldn't immediately explain.
					Each time I hit a wall I reminded myself that cutting corners because something was hard would be a
					discount on my own learning. This is my passion, and I was willing to let it be hard.
				</p>

				<h3 style={{ textAlign: "center" }}>What I Would Do Differently</h3>
				<p>
					If I were to continue the project I would build a proper tutorial since the controls were tuned to
					my preferences after dozens of hours of playtime — a new player would likely struggle without
					guidance. I would also add a settings menu to allow players to adjust sensitivity values that I had
					hardcoded to my own preferences.
				</p>
			</div>
		),
		features: [
			"State Machine Architecture",
			"Physics-Based Controller",
			"Input Buffering",
			"Slope & Stair Detection",
			"Camera Smoothing",
		],
		tags: ["Unity", "Solo Project"],
		images: [
			"media/BankEscape/first_room.png",
			"media/BankEscape/long_wallrun_room.png",
			"media/BankEscape/moving_platform_room.png",
			"media/BankEscape/curved_wallrun_room.png",
			"media/BankEscape/full_run.mov",
		],
		githubLink: "https://github.com/jrj221/Unity_Movement",
		playLink: "https://jrj221.itch.io/bank-escape",
	},
	{
		title: "Fishing for Love",
		description: (
			<p className="project-description-html">
				Fishing for Love was created for the BYU Game Dev Club Winter 2026 Game Jam. Players cast their hook,
				reel in hearts, and try to win different endings based on how many hearts they collect.
			</p>
		),
		features: ["UI Toolkit", "SFX", "Sprite Masking", "Coroutines"],
		tags: ["Unity", "Game Jam Project", "Solo"],
		githubLink: "https://github.com/jrj221/Fishing-for-Love",
		playLink: "https://jrj221.itch.io/fishing-for-love",
		images: [
			"media/FishingForLove/gameplay.png",
			"media/FishingForLove/difficultySelect.png",
			"media/FishingForLove/mainMenu.png",
		],
	},
];

const GameDevProjects = () => {
	const [selectedProject, setSelectedProject] = useState<Project | null>(null);
	const [currentIndex, setCurrentIndex] = useState(0);

	const prevImage = () => {
		if (!selectedProject) return;
		setCurrentIndex((prev) => (prev === 0 ? selectedProject.images.length - 1 : prev - 1));
	};

	const nextImage = () => {
		if (!selectedProject) return;
		setCurrentIndex((prev) => (prev === selectedProject.images.length - 1 ? 0 : prev + 1));
	};

	const openPopup = (project: Project) => {
		setSelectedProject(project);
		setCurrentIndex(0);
	};

	const closePopup = () => {
		setSelectedProject(null);
	};

	const isVideo = (url: string) => {
		const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];
		return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
	};

	return (
		<>
			{/* Game Dev Header */}
			<header className="site-header">
				<div className="container navbar" role="navigation" aria-label="Main">
					<div className="brand">
						<span className="brand-dot" aria-hidden="true"></span>
						<a href="/">
							<span>&lt; Jack Johnson /&gt;</span>
						</a>
					</div>
				</div>
			</header>

			{/* Game Dev Projects */}
			<section className="section container" id="projects" style={{ paddingTop: "80px" }}>
				<h2 className="section-title" style={{ fontSize: "42px", marginBottom: "40px" }}>
					Game Development Projects
				</h2>
				<div className="project-grid" style={{ gridTemplateColumns: "1fr" }}>
					{projects.map((project, index) => (
						<GameDevProjectCard key={index} project={project} onClick={() => openPopup(project)} />
					))}
				</div>
			</section>

			{/* Popup */}
			{selectedProject && (
				<div className="project-popup-overlay" onClick={closePopup}>
					<div className="project-popup-content" onClick={(e) => e.stopPropagation()}>
						<button className="project-popup-close" onClick={closePopup}>
							✕
						</button>

						<div className="project-popup-split">
							{/* Left side: Carousel and Links */}
							<div className="project-popup-left">
								<h2 className="project-popup-title">{selectedProject.title}</h2>

								<div className="carousel" style={{ maxWidth: "100%", margin: "0" }}>
									<button className="carousel-btn left" onClick={prevImage}>
										&#10094;
									</button>
									{isVideo(selectedProject.images[currentIndex] || "") ? (
										<video
											key={selectedProject.images[currentIndex] || "video-default"}
											src={selectedProject.images[currentIndex] || ""}
											controls
											muted
											loop
											playsInline
											style={{
												width: "100%",
												display: "block",
												borderRadius: "8px",
												background: "#000",
											}}
										/>
									) : (
										<img
											src={selectedProject.images[currentIndex] || ""}
											alt={selectedProject.title}
										/>
									)}
									<button className="carousel-btn right" onClick={nextImage}>
										&#10095;
									</button>
								</div>

								<div className="project-actions" style={{ marginTop: "32px", marginLeft: "0" }}>
									{!!selectedProject.githubLink && (
										<a
											className="btn"
											href={selectedProject.githubLink}
											target="_blank"
											rel="noopener noreferrer"
										>
											View on GitHub
										</a>
									)}
									{!!selectedProject.playLink && (
										<a
											className="btn"
											href={selectedProject.playLink}
											target="_blank"
											rel="noopener noreferrer"
											style={{ marginLeft: "10px" }}
										>
											Play on itch.io
										</a>
									)}
								</div>

								<div
									className="project-tags"
									style={{
										display: "flex",
										flexWrap: "wrap",
										gap: "8px",
										marginTop: "24px",
									}}
								>
									{selectedProject.tags.map((tag) => (
										<span
											key={tag}
											className="project-tag"
											style={{
												background: "var(--color-bg-alt)",
												padding: "6px 12px",
												borderRadius: "var(--radius-sm)",
												fontSize: "14px",
												color: "var(--color-text)",
											}}
										>
											{tag}
										</span>
									))}
								</div>
							</div>

							{/* Right side: Scrolling Text */}
							<div className="project-popup-right">{selectedProject.description}</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default GameDevProjects;
