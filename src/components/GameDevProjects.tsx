import Header from "./Header";
import { useState } from "react";
import GameDevProjectCard from "./GameDevProjectCard";

const GameDevProjects = () => {
	const images: string[] = ["chess.png", "chess.png", "chess.png"];
	const [currentIndex, setCurrentIndex] = useState(0);

	const prevImage = () => {
		setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
	};

	const nextImage = () => {
		setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
	};
	return (
		<>
			{/* Game Dev Header */}
			<div className="container navbar" role="navigation" aria-label="Main">
				<div className="brand">
					<span className="brand-dot" aria-hidden="true"></span>
					<a href="/">
						<span>&lt; Jack Johnson /&gt;</span>
					</a>
				</div>
			</div>

			{/* Game Dev Projects */}
			<section className="section container" id="projects">
				<h2 className="section-title">Game Development Projects</h2>
				<div className="project-grid">
					<GameDevProjectCard
						title="Fishing for Love"
						description="Fishing for Love was created for the BYU Game Dev Club Winter 2026 Game Jam. Players cast their hook, reel in hearts, and try to win different endings based on how many hearts they collect."
						features={["UI Toolkit", "SFX", "Sprite Masking", "Coroutines"]}
						tags={["Unity", "Game Jam Project", "Solo"]}
						githubLink="https://github.com/jrj221/Fishing-for-Love"
						playLink="https://jrj221.itch.io/fishing-for-love"
						images={[
							"images/FishingForLove/gameplay.png",
							"images/FishingForLove/difficultySelect.png",
							"images/FishingForLove/mainMenu.png",
						]}
					/>
				</div>
			</section>
		</>
	);
};

export default GameDevProjects;
