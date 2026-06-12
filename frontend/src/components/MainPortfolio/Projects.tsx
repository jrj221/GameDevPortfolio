import type { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faAppStore, faItchIo } from "@fortawesome/free-brands-svg-icons";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

// Pick a brand icon based on where the link points
const linkIconFor = (href: string) => {
	if (href.includes("github.com")) return faGithub;
	if (href.includes("apps.apple.com")) return faAppStore;
	if (href.includes("itch.io")) return faItchIo;
	return faArrowUpRightFromSquare;
};

const ProjectLink = ({ href, children }: { href: string; children: ReactNode }) => (
	<a className="btn" href={href} target="_blank" rel="noopener">
		<FontAwesomeIcon icon={linkIconFor(href)} />
		{children}
	</a>
);

const Projects = () => {
	return (
		<section className="section container" id="projects">
			<h2 className="section-title">Projects</h2>
			<div className="project-grid">
				<article className="project-card">
					<img src="media/GeneralPortolio/chess.png" alt="Chess" />
					<h3>Chess Game</h3>
					<p>
						Features a networked client-server architecture, with a command-line client, a server to manage
						users and games, and shared modules for implementing chess rules and game state management.
					</p>
					<div className="project-tags">
						<span className="project-tag">Java</span>
						<span className="project-tag">MySQL</span>
						<span className="project-tag">Javalin</span>
					</div>
					<div className="project-actions">
						<ProjectLink href="https://github.com/jrj221/chess">View on GitHub</ProjectLink>
					</div>
				</article>

				<article className="project-card">
					<img src="media/GeneralPortolio/imageCompression.png" alt="Image Compression" />
					<h3>PNG Image Compression</h3>
					<p>
						Uses pixel approximation to optimize the .PNG deflation algorithm. On large files, managed to
						decrease size by <strong>more than 80%</strong>
					</p>
					<div className="project-tags">
						<span className="project-tag">Python</span>
						<span className="project-tag">Pillow</span>
					</div>
					<div className="project-actions">
						<ProjectLink href="https://github.com/jrj221/ImageCompression">View on GitHub</ProjectLink>
					</div>
				</article>

				<article className="project-card">
					<img src="media/GeneralPortolio/cougsConnect.png" alt="Cougs Connect Social Media Page" />
					<h3>CougsConnect - Social Media Web App</h3>
					<p>
						Developed a social media web app in a <strong>team of 3</strong> during an{" "}
						<strong>18-hour hackathon</strong> for college freshmen. Includes <strong>AI powered</strong>{" "}
						post filtering to enhance event discovery.
					</p>
					<div className="project-tags">
						<span className="project-tag">GPT 4.1-nano</span>
						<span className="project-tag">HTML/CSS</span>
						<span className="project-tag">Express</span>
					</div>
					<div className="project-actions">
						<ProjectLink href="https://github.com/jrj221/CougsConnect">View on GitHub</ProjectLink>
					</div>
				</article>

				<article className="project-card">
					<img src="media/GeneralPortolio/tictactoe.png" alt="Ultimate Tic Tac Toe" />
					<h3>Ultimate Tic Tac Toe</h3>
					<p>
						Web game where you have to win three entire games of Tic-Tac-Toe in a valid order to win the
						outer game.
					</p>
					<div className="project-tags">
						<span className="project-tag">HTML/CSS</span>
						<span className="project-tag">JavaScript</span>
					</div>
					<div className="project-actions">
						<ProjectLink href="https://github.com/jrj221/TicTacToeSquared">View on GitHub</ProjectLink>
						<ProjectLink href="https://tictactoe.jackjohnson.click">View in Browser</ProjectLink>
					</div>
				</article>

				<article className="project-card">
					<img src="media/BudgetApp/budget_app_icon.png" alt="Money & Me | iOS Budgeting App" />
					<h3>Money & Me | iOS Budgeting App</h3>
					<p>
						An iOS app designed for teens and young adults to help them track spending, make financial
						goals, and manage budgets.
					</p>
					<div className="project-tags">
						<span className="project-tag">React Expo</span>
						<span className="project-tag ai-tag">Made with AI</span>
					</div>
					<div className="project-actions">
						<ProjectLink href="https://apps.apple.com/us/app/money-me/id6769168491">
							View in App Store
						</ProjectLink>
					</div>
				</article>

				<article className="project-card">
					<img
						src="media/ScorekeeperApp/scorekeeper_app_icon.png"
						alt="What's the Score? | iOS Scorekeeping App"
					/>
					<h3>What's the Score? | iOS Scorekeeping App</h3>
					<p>
						An iOS app designed to help groups keep track of game scores, with extra feature like game
						templates, dice, timers, and historical player stats.
					</p>
					<div className="project-tags">
						<span className="project-tag">React Expo</span>
						<span className="project-tag ai-tag">Made with AI</span>
					</div>
					<div className="project-actions">
						<ProjectLink href="https://apps.apple.com/us/app/whats-the-score-game-night/id6772616074">
							View in App Store
						</ProjectLink>
					</div>
				</article>

				{/* <article className="project-card">
					<img src="media/GeneralPortolio/agenda.png" alt="Agenda" />
					<h3>Agenda</h3>
					<p>
						A smart, AI-integrated productivity tool designed to streamline schedule management and task
						prioritization.
					</p>
					<div className="project-tags">
						<span className="project-tag">React</span>
						<span className="project-tag">TypeScript</span>
						<span className="project-tag ai-tag">Built with AI</span>
					</div>
					<div className="project-actions">
						<ProjectLink href="/agenda/">View in Browser</ProjectLink>
					</div>
				</article> */}
			</div>
		</section>
	);
};

export default Projects;
