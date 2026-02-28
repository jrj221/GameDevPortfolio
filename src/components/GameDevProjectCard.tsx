import { useState } from "react";

interface Props {
	title: string;
	description: string;
	features: string[];
	tags: string[];
	githubLink: string;
	playLink?: string;
	images: string[];
}

function GameDevProjectCard(props: Props) {
	const [currentIndex, setCurrentIndex] = useState(0);

	const prevImage = () => {
		setCurrentIndex((prev) => (prev === 0 ? props.images.length - 1 : prev - 1));
	};

	const nextImage = () => {
		setCurrentIndex((prev) => (prev === props.images.length - 1 ? 0 : prev + 1));
	};

	return (
		<article className="project-card">
			<div className="carousel">
				<button className="carousel-btn left" onClick={prevImage}>
					&#10094;
				</button>
				<img src={props.images[currentIndex]} alt={props.title} />
				<button className="carousel-btn right" onClick={nextImage}>
					&#10095;
				</button>
			</div>
			<h3>{props.title}</h3>
			<p>{props.description}</p>
			<div className="project-features">
				<h4>Features / Skills Learned:</h4>
				<ul>
					{props.features.map((feature) => (
						<li key={feature}>{feature}</li>
					))}
				</ul>
			</div>

			<div className="project-tags">
				{props.tags.map((tag) => (
					<span key={tag} className="project-tag">
						{tag}
					</span>
				))}
			</div>
			<div className="project-actions">
				<a className="btn" href={props.githubLink} target="_blank" rel="noopener noreferrer">
					View on GitHub
				</a>
				{!!props.playLink && (
					<a className="btn" href={props.playLink} target="_blank" rel="noopener noreferrer">
						Play on itch.io
					</a>
				)}
			</div>
		</article>
	);
}

export default GameDevProjectCard;
