import "./Portfolio.css";
import { Link } from "react-router-dom";

const Portfolio = () => {
	return (
		<div>
			{/* Header */}
			<header className="site-header">
				<div className="container navbar" role="navigation" aria-label="Main">
					<div className="brand">
						<span className="brand-dot" aria-hidden="true"></span>
						<a href="#home">
							<span>&lt; Jack Johnson /&gt;</span>
						</a>
					</div>
					<nav className="nav-links">
						<a href="/Jack Johnson Resume.pdf" target="_blank">
							Resume
						</a>
						<a href="#education">Education</a>
						<a href="#experience">Experience</a>
						<a href="#projects">Projects</a>
						<a href="#skills">Skills</a>
						<p> | </p>
						<a href="#contact">Contact</a>
					</nav>
				</div>
			</header>

			<main>
				{/* Hero */}
				<section className="hero-section container" id="home">
					<h1 className="hero-title">Hey, I'm Jack!</h1>
					<p className="hero-subtitle">Explore my website to learn more about me!</p>
				</section>

				{/* Education  */}
				<section className="section container education-section" id="education">
					<h2 className="section-title">Education</h2>
					<div className="education-card">
						{/* <!-- Left side: logo --> */}
						<div className="edu-logo">
							<img src="byuLogo.png" alt="Brigham Young University logo" />
						</div>

						{/* <!-- Right side: details --> */}
						<div className="edu-details">
							<h3 className="edu-school">Brigham Young University — Expected May 2027</h3>
							<em>
								<p className="edu-location">Provo, UT</p>
							</em>
							<p className="edu-degree">Computer Science</p>
							<p className="edu-gpa">
								<strong>GPA:</strong> 3.97
							</p>
							<div className="edu-coursework">
								<strong>Relevant coursework:</strong>
								<ul>
									<li>Web Programming</li>
									<li>Advanced Software Construction</li>
									<li>Software Design</li>
								</ul>
							</div>
							<p className="edu-awards">
								<strong>Awards:</strong> BYU Academic Scholarship
							</p>
							<p className="edu-clubs">
								<strong>Clubs:</strong> BYU Developers Club
							</p>
						</div>
					</div>
				</section>

				{/* Experience */}
				<section className="section container experience-section" id="experience">
					<h2 className="section-title">Experience</h2>
					<div className="experience-grid">
						<article className="experience-card">
							{/* <!-- Left: details --> */}
							<div className="exp-details-block">
								<h3>Computer Science Teaching Assistant</h3>
								<p className="exp-company">Brigham Young University · September 2025 – Present</p>
								<ul className="exp-details">
									<li>
										Improved student comprehension by implementing innovative teaching methods and
										incorporating visual aids in <strong>bi-weekly</strong> lessons of{" "}
										<strong>35+ students</strong>.
									</li>
									<li>
										Provided one‑on‑one debugging support to students, improving their understanding
										of programming concepts <strong>by 50%</strong>.
									</li>
									<li>
										Provided timely feedback to students,{" "}
										<strong>grading 100+ assignments weekly.</strong>
									</li>
								</ul>
							</div>
							{/* <!-- Right: image --> */}
							<div className="exp-logo">
								<img src="byuLogo.png" alt="BYU logo" />
							</div>
						</article>

						<article className="experience-card">
							{/* <!-- Left: details --> */}
							<div className="exp-details-block">
								<h3>Supervisor</h3>
								<p className="exp-company">Papa Murphy's Pizza · June 2022 - August 2023</p>
								<ul className="exp-details">
									<li>
										Resolved <strong>30+</strong> customer inquiries daily, achieving a{" "}
										<strong>40% increase</strong> in customer satisfaction and demonstrating strong
										communication under pressure.
									</li>
									<li>
										Led and mentored a <strong>team of 6</strong>, improving onboarding efficiency
										by <strong>30%</strong> and fostering strong collaboration.
									</li>
								</ul>
							</div>
							{/* <!-- Right: image --> */}
							<div className="exp-logo">
								<img src="papaMurphysLogo.png" alt="Papa Murphy's Pizza logo" />
							</div>
						</article>
					</div>
				</section>

				{/* Projects */}
				<section className="section container" id="projects">
					<h2 className="section-title">Projects</h2>
					<div className="project-grid">
						<article className="project-card">
							<img src="chess.png" alt="Chess" />
							<h3>Chess Game</h3>
							<p>
								Features a networked client-server architecture, with a command-line client, a server to
								manage users and games, and shared modules for implementing chess rules and game state
								management.
							</p>
							<div className="project-tags">
								<span className="project-tag">Java</span>
								<span className="project-tag">MySQL</span>
								<span className="project-tag">Javalin</span>
							</div>
							<div className="project-actions">
								<a
									className="btn"
									href="https://github.com/jrj221/chess"
									target="_blank"
									rel="noopener"
								>
									View on GitHub
								</a>
							</div>
						</article>

						<article className="project-card">
							<img src="imageCompression.png" alt="Image Compression" />
							<h3>PNG Image Compression</h3>
							<p>
								Uses pixel approximation to optimize the .PNG deflation algorithm. On large files,
								managed to decrease size by <strong>more than 80%</strong>
							</p>
							<div className="project-tags">
								<span className="project-tag">Python</span>
								<span className="project-tag">Pillow</span>
							</div>
							<div className="project-actions">
								<a
									className="btn"
									href="https://github.com/jrj221/ImageCompression"
									target="_blank"
									rel="noopener"
								>
									View on GitHub
								</a>
							</div>
						</article>

						<article className="project-card">
							<img src="cougsConnect.png" alt="Cougs Connect Social Media Page" />
							<h3>CougsConnect - Social Media Web App</h3>
							<p>
								Developed a social media web app in a <strong>team of 3</strong> during an{" "}
								<strong>18-hour hackathon</strong> for college freshmen. Includes{" "}
								<strong>AI powered</strong> post filtering to enhance event discovery.
							</p>
							<div className="project-tags">
								<span className="project-tag">GPT 4.1-nano</span>
								<span className="project-tag">HTML/CSS</span>
								<span className="project-tag">Express</span>
							</div>
							<div className="project-actions">
								<a
									className="btn"
									href="https://github.com/jrj221/CougsConnect"
									target="_blank"
									rel="noopener"
								>
									View on GitHub
								</a>
							</div>
						</article>

						<article className="project-card">
							<img src="tictactoe.png" alt="Ultimate Tic Tac Toe" />
							<h3>Ultimate Tic Tac Toe</h3>
							<p>
								Web game where you have to win three entire games of Tic-Tac-Toe in a valid order to win
								the outer game.
							</p>
							<div className="project-tags">
								<span className="project-tag">HTML/CSS</span>
								<span className="project-tag">JavaScript</span>
							</div>
							<div className="project-actions">
								<a
									className="btn"
									href="https://github.com/jrj221/TicTacToeSquared"
									target="_blank"
									rel="noopener"
								>
									View on GitHub
								</a>
								<a className="btn" href="https://tictactoe.jackjohnson.click" target="_blank">
									View in Browser
								</a>
							</div>
						</article>
					</div>
				</section>

				{/* Skills */}
				<section className="section container" id="skills">
					<h2 className="section-title">Skills</h2>
					<div className="skills-list">
						<span className="skill-item">Frontend: React, JavaScript, TypeScript, HTML, CSS</span>
						<span className="skill-item">Familiar Languages: Python, C++, C, C#, Java, SQL</span>
					</div>
				</section>

				{/* Contact */}
				<section className="section container" id="contact">
					<h2 className="section-title">Contact</h2>
					<form className="contact-form" action="#" method="post">
						<input className="form-input" type="text" name="name" placeholder="Your name" required />
						<input className="form-input" type="email" name="email" placeholder="Email address" required />
						<textarea className="form-input" name="message" placeholder="Your message" required></textarea>
						<button className="btn btn-primary" type="submit">
							Send message
						</button>
					</form>
				</section>
			</main>
		</div>
	);
};

export default Portfolio;
