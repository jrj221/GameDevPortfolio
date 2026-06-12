import { useRef, type CSSProperties } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import type { ProjectSummary } from "../../net/IServerFacade";
import { formatMinutes } from "../../presenters/ProjectContributionsPresenter";

interface ProjectCardProps {
	project: ProjectSummary;
	index: number;
	isSelected: boolean;
	isRemoving: boolean;
	isJustAdded: boolean;
	onSelect: () => void;
	onEdit: () => void;
	onDelete: () => void;
	onRemoved: () => void;
	onCreated: () => void;
}

const ProjectCard = ({
	project,
	index,
	isSelected,
	isRemoving,
	isJustAdded,
	onSelect,
	onEdit,
	onDelete,
	onRemoved,
	onCreated,
}: ProjectCardProps) => {
	// Decide the entrance animation once, at mount: a freshly created card grows
	// into place; everything else slides in with the initial-load batch. Captured
	// in a ref so later prop changes never re-trigger an entrance animation.
	const createdOnMount = useRef(isJustAdded);
	const entranceClass = createdOnMount.current ? "contrib-card-created" : "contrib-card-enter";

	return (
		<div
			className={`contrib-card ${isRemoving ? "contrib-card-removing" : entranceClass} ${
				isSelected ? "is-selected" : ""
			}`}
			style={
				{
					"--card-color": project.color,
					// Stagger the initial slide-in only; grow + exit play immediately.
					animationDelay: isRemoving || createdOnMount.current ? "0s" : `${Math.min(index, 15) * 0.05}s`,
				} as CSSProperties
			}
			role="button"
			tabIndex={0}
			onClick={onSelect}
			onAnimationEnd={(e) => {
				if (e.animationName === "contrib-card-out") onRemoved();
				if (e.animationName === "contrib-card-grow") onCreated();
			}}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onSelect();
				}
			}}
		>
		<div className="contrib-card-actions">
			<button
				className="contrib-icon-btn contrib-icon-edit"
				onClick={(e) => {
					e.stopPropagation();
					onEdit();
				}}
				aria-label={`Edit ${project.projectName}`}
			>
				<FontAwesomeIcon icon={faPen} />
			</button>
			<button
				className="contrib-icon-btn contrib-icon-delete"
				onClick={(e) => {
					e.stopPropagation();
					onDelete();
				}}
				aria-label={`Delete ${project.projectName}`}
			>
				<FontAwesomeIcon icon={faTrash} />
			</button>
		</div>
		<span className="contrib-card-name">{project.projectName}</span>
		<span className="contrib-card-meta">
			{project.entryCount} {project.entryCount === 1 ? "entry" : "entries"}
			{" · "}
			{formatMinutes(project.totalMinutes)}
		</span>
	</div>
	);
};

export default ProjectCard;
