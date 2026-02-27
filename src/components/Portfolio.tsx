import "./Portfolio.css"; // Duplicated in other components for now
import Education from "./Education";
import Experience from "./Experience";
import Header from "./Header";
import Projects from "./Projects";
import Skills from "./Skills";
import Contact from "./Contact";

const Portfolio = () => {
	return (
		<div>
			<Header />
			<main>
				{/* Hero */}
				<section className="hero-section container" id="home">
					<h1 className="hero-title">Hey, I'm Jack!</h1>
					<p className="hero-subtitle">Explore my website to learn more about me!</p>
				</section>

				<Education />
				<Experience />
				<Projects />
				<Skills />
				<Contact />
			</main>
		</div>
	);
};

export default Portfolio;
