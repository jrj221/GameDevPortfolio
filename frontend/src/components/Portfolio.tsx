import "../stylesheets/global.css";
import "../stylesheets/MainPortfolio/MainPortfolio.css";
import Education from "./MainPortfolio/Education";
import Experience from "./MainPortfolio/Experience";
import Header from "./Header";
import Projects from "./MainPortfolio/Projects";
import Skills from "./MainPortfolio/Skills";
import Contact from "./MainPortfolio/Contact";

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
