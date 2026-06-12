import { Project } from "./GameDevProjects";

interface Props {
	project: Project;
	onClick: () => void;
}

function GameDevProjectCard({ project, onClick }: Props) {
	return (
		<article
			className="project-card"
			onClick={onClick}
			style={{
				cursor: "pointer",
				display: "flex",
				flexDirection: "row",
				alignItems: "stretch",
				minHeight: "320px",
				overflow: "hidden",
			}}
		>
			{/* Left Column: Image Hero */}
			<div
				className="project-card-image-column"
				style={{
					flex: "0 0 540px",
					background: "#000",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<img
					src={project.images[0]}
					alt={project.title}
					style={{
						width: "100%",
						height: "100%",
						objectFit: "contain",
						display: "block",
					}}
				/>
			</div>

			{/* Right Column: Integrated Info & Sidebar */}
			<div
				className="project-card-content-column"
				style={{
					flex: 1,
					padding: "30px",
					display: "flex",
					flexDirection: "column",
					background: "var(--color-bg-alt)",
					borderLeft: "1px solid var(--color-border)",
				}}
			>
				<h3 style={{ fontSize: "28px", margin: "0 0 20px 0", color: "var(--color-text)" }}>{project.title}</h3>

				<div
					className="project-features"
					style={{ flex: 1, padding: 0, margin: "0 0 24px 0", background: "transparent" }}
				>
					<h4 style={{ margin: "0 0 12px 0", fontSize: "16px", color: "var(--color-text-muted)" }}>
						Technical Features:
					</h4>
					<ul style={{ paddingLeft: "18px", margin: 0 }}>
						{project.features.map((feature) => (
							<li
								key={feature}
								style={{ marginBottom: "6px", fontSize: "0.95rem", color: "var(--color-text-muted)" }}
							>
								{feature}
							</li>
						))}
					</ul>
				</div>

				<div className="project-actions" style={{ display: "flex", marginTop: "auto" }}>
					{!!project.githubLink && (
						<a
							className="btn"
							href={project.githubLink}
							target="_blank"
							rel="noopener noreferrer"
							onClick={(e) => e.stopPropagation()}
						>
							View on GitHub
						</a>
					)}
					{!!project.playLink && (
						<a
							className="btn"
							href={project.playLink}
							target="_blank"
							rel="noopener noreferrer"
							onClick={(e) => e.stopPropagation()}
							style={{ marginLeft: "10px" }}
						>
							Play on itch.io
						</a>
					)}
				</div>
			</div>
		</article>
	);
}

export default GameDevProjectCard;
