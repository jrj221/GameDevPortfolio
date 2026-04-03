import "./Portfolio.css";

const Experience = () => {
	return (
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
								Provided one‑on‑one debugging support to students, improving their understanding of
								programming concepts <strong>by 50%</strong>.
							</li>
							<li>
								Provided timely feedback to students, <strong>grading 100+ assignments weekly.</strong>
							</li>
						</ul>
					</div>
					{/* <!-- Right: image --> */}
					<div className="exp-logo">
						<img src="media/GeneralPortolio/byuLogo.png" alt="BYU logo" />
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
								Led and mentored a <strong>team of 6</strong>, improving onboarding efficiency by{" "}
								<strong>30%</strong> and fostering strong collaboration.
							</li>
						</ul>
					</div>
					{/* <!-- Right: image --> */}
					<div className="exp-logo">
						<img src="media/GeneralPortolio/papaMurphysLogo.png" alt="Papa Murphy's Pizza logo" />
					</div>
				</article>
			</div>
		</section>
	);
};

export default Experience;
