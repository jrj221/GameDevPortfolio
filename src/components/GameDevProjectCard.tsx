import { Project } from "./GameDevProjects";

interface Props {
	project: Project;
	onClick: () => void;
}

function GameDevProjectCard({ project, onClick }: Props) {
	return (
		<article className="project-card" onClick={onClick} style={{ cursor: "pointer", display: "flex", flexDirection: "row", alignItems: "stretch" }}>
			<div className="project-card-main" style={{ flex: 1 }}>
				<img src={project.images[0]} alt={project.title} style={{ width: "100%", height: "auto", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
				<h3 style={{ fontSize: "24px", margin: "20px" }}>{project.title}</h3>
			</div>
			
			<div className="project-card-sidebar" style={{ 
				width: "300px", 
				borderLeft: "1px solid var(--color-border)", 
				padding: "20px", 
				background: "var(--color-bg-alt)", 
				flexShrink: 0,
				display: "flex",
				flexDirection: "column"
			}}>
				<div className="project-features" style={{ flex: 1, padding: 0, marginBottom: "20px", background: "transparent" }}>
					<h4 style={{ margin: "0 0 12px 0", fontSize: "16px", color: "var(--color-text)" }}>Technical Features:</h4>
					<ul style={{ paddingLeft: "20px", margin: "0 0 24px 0" }}>
						{project.features.map((feature) => (
							<li key={feature} style={{ marginBottom: "8px", fontSize: "0.95rem", color: "var(--color-text-muted)" }}>{feature}</li>
						))}
					</ul>
				</div>
				
				<div className="project-tags" style={{ margin: 0 }}>
					{project.tags.map((tag) => (
						<span key={tag} className="project-tag" style={{ display: "inline-block", marginBottom: "8px", marginRight: "8px" }}>
							{tag}
						</span>
					))}
				</div>
			</div>
		</article>
	);
}

export default GameDevProjectCard;
