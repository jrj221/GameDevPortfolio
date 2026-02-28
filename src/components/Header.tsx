import { Link } from "react-router-dom";
import "./Portfolio.css";

const Header = () => {
	return (
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
					<a href="/#education">Education</a>
					<a href="/#experience">Experience</a>
					<a href="/#projects">Projects</a>
					<Link to="/gamedev">Game Dev</Link>
					<a href="/#skills">Skills</a>
					<p> | </p>
					<a href="/#contact">Contact</a>
				</nav>
			</div>
		</header>
	);
};

export default Header;
