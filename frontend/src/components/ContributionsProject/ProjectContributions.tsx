import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import "../../stylesheets/global.css";
import "../../stylesheets/ContributionsProject/ProjectContributions.css";
import type { Contribution, ProjectSummary } from "../../net/IServerFacade";
import {
	DEFAULT_COLOR,
	PRESET_COLORS,
	isNegativeHours,
	ProjectContributionsPresenter,
	type ConfirmState,
	type EditingProject,
	type ProjectContributionsView,
} from "../../presenters/ProjectContributionsPresenter";
import AutoTextarea from "./AutoTextarea";
import ProjectCard from "./ProjectCard";
import ContributionEntry from "./ContributionEntry";

const ProjectContributions = () => {
	const [projects, setProjects] = useState<ProjectSummary[]>([]);
	const [loadingProjects, setLoadingProjects] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [selectedName, setSelectedName] = useState<string | null>(null);
	const [isClosing, setIsClosing] = useState(false);
	const [entries, setEntries] = useState<Contribution[]>([]);
	const [loadingEntries, setLoadingEntries] = useState(false);

	// Keep the selected project name in a ref so async callbacks can tell
	// whether the user has since navigated away before applying entry updates.
	const selectedNameRef = useRef<string | null>(null);
	selectedNameRef.current = selectedName;

	// New project form
	const [showProjectForm, setShowProjectForm] = useState(false);
	const [newProjectName, setNewProjectName] = useState("");
	const [newProjectColor, setNewProjectColor] = useState(DEFAULT_COLOR);

	// New entry form
	const [newEntryHours, setNewEntryHours] = useState("");
	const [newEntryDescription, setNewEntryDescription] = useState("");

	// Inline entry editing
	const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
	const [editHours, setEditHours] = useState("");
	const [editDescription, setEditDescription] = useState("");

	// Project edit modal + delete confirmation modal
	const [editingProject, setEditingProject] = useState<EditingProject | null>(null);
	const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);

	// Cards/entries currently playing their fade-out animation before removal.
	const [removingEntryIds, setRemovingEntryIds] = useState<string[]>([]);
	const [removingProjectNames, setRemovingProjectNames] = useState<string[]>([]);

	// The project just created, so its card plays the "grow into place" animation.
	const [justAddedName, setJustAddedName] = useState<string | null>(null);

	// Carousel paging: index of the leftmost visible tile.
	const [pageStart, setPageStart] = useState(0);

	// Expose the current state + setters to the presenter. The ref is re-pointed
	// every render so the (stable) presenter always reads the latest values.
	const viewRef = useRef<ProjectContributionsView>(null!);
	viewRef.current = {
		projects,
		selectedName,
		isClosing,
		selectedNameRef,
		newProjectName,
		newProjectColor,
		newEntryHours,
		newEntryDescription,
		editHours,
		editDescription,
		editingProject,
		setProjects,
		setLoadingProjects,
		setError,
		setSelectedName,
		setIsClosing,
		setEntries,
		setLoadingEntries,
		setShowProjectForm,
		setNewProjectName,
		setNewProjectColor,
		setNewEntryHours,
		setNewEntryDescription,
		setEditingEntryId,
		setEditHours,
		setEditDescription,
		setEditingProject,
		setConfirmState,
		setRemovingEntryIds,
		setRemovingProjectNames,
		setJustAddedName,
		setPageStart,
	};
	const presenter = useMemo(() => new ProjectContributionsPresenter(() => viewRef.current), []);

	const selectedProject = projects.find((p) => p.projectName === selectedName) ?? null;

	// Load the project roster from the backend on mount.
	useEffect(() => presenter.loadProjects(), [presenter]);

	// Load the selected project's entries whenever the selection changes.
	useEffect(() => {
		if (!selectedName) return;
		return presenter.loadContributions(selectedName);
	}, [selectedName, presenter]);

	const addHoursInvalid = isNegativeHours(newEntryHours);
	const editHoursInvalid = isNegativeHours(editHours);

	// Carousel: the row shows VISIBLE_TILES at a time (projects + the add card).
	// Arrows page by a full window, clamped so the window never runs past the end.
	const VISIBLE_TILES = 4;
	const totalTiles = projects.length + 1;
	const maxPageStart = Math.max(0, totalTiles - VISIBLE_TILES);
	const start = Math.min(pageStart, maxPageStart);
	const canPageLeft = start > 0;
	const canPageRight = start < maxPageStart;

	return (
		<>
			{/* Header (links back home) */}
			<header className="site-header">
				<div className="container navbar" role="navigation" aria-label="Main">
					<div className="brand">
						<span className="brand-dot" aria-hidden="true"></span>
						<a href="/">
							<span>&lt; Jack Johnson /&gt;</span>
						</a>
					</div>
				</div>
			</header>

			<main className={`contrib-page ${selectedProject ? "has-selection" : ""}`}>
				{/* Top row of project cards */}
				<section className="contrib-top">
					<h1 className="contrib-title">Project Tracker</h1>

					{error && <p className="contrib-error">{error}</p>}

					<div className="contrib-carousel">
						<button
							className="contrib-arrow contrib-arrow-left"
							onClick={() => setPageStart(Math.max(start - VISIBLE_TILES, 0))}
							aria-label="Show previous projects"
							style={{ visibility: canPageLeft ? "visible" : "hidden" }}
						>
							‹
						</button>

						<div className="contrib-carousel-viewport">
							<div className="contrib-carousel-track" style={{ "--page-start": start } as CSSProperties}>
								{!loadingProjects &&
									projects.map((project, index) => (
										<ProjectCard
											key={project.projectName}
											project={project}
											index={index}
											isSelected={selectedName === project.projectName}
											isRemoving={removingProjectNames.includes(project.projectName)}
											isJustAdded={justAddedName === project.projectName}
											onSelect={() => presenter.selectProject(project.projectName)}
											onEdit={() => presenter.openEditProject(project)}
											onDelete={() => presenter.requestDeleteProject(project)}
											onRemoved={() => void presenter.finalizeDeleteProject(project)}
											onCreated={() => presenter.clearJustAdded()}
										/>
									))}

								{/* Add-project card */}
								<button
									className="contrib-card contrib-card-add"
									onClick={() => setShowProjectForm((s) => !s)}
								>
									<span className="contrib-card-add-plus">+</span>
									<span className="contrib-card-name">New Project</span>
								</button>
							</div>
						</div>

						<button
							className="contrib-arrow contrib-arrow-right"
							onClick={() => setPageStart(Math.min(start + VISIBLE_TILES, maxPageStart))}
							aria-label="Show more projects"
							style={{ visibility: canPageRight ? "visible" : "hidden" }}
						>
							›
						</button>
					</div>

					{showProjectForm && (
						<div className="contrib-project-form">
							<button
								className="contrib-form-close"
								onClick={() => presenter.cancelProjectForm()}
								aria-label="Cancel new project"
							>
								✕
							</button>
							<input
								className="contrib-input"
								type="text"
								placeholder="Project name"
								value={newProjectName}
								style={{ borderColor: newProjectColor }}
								onChange={(e) => setNewProjectName(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") void presenter.addProject();
									if (e.key === "Escape") presenter.cancelProjectForm();
								}}
								autoFocus
							/>
							<div className="contrib-swatches">
								{PRESET_COLORS.map((color) => (
									<button
										key={color}
										className={`contrib-swatch ${newProjectColor === color ? "is-active" : ""}`}
										style={{ background: color }}
										aria-label={`Pick color ${color}`}
										onClick={() => setNewProjectColor(color)}
									/>
								))}
							</div>
							<button className="btn contrib-btn" onClick={() => void presenter.addProject()}>
								Create
							</button>
						</div>
					)}
				</section>

				{/* Expanding bottom panel for the selected project */}
				<section
					className={`contrib-panel ${selectedProject && !isClosing ? "is-open" : ""} ${isClosing ? "is-closing" : ""}`}
					style={selectedProject ? ({ "--panel-color": selectedProject.color } as CSSProperties) : undefined}
					onAnimationEnd={(e) => presenter.handlePanelAnimationEnd(e.animationName)}
				>
					{selectedProject && (
						<div className="contrib-panel-inner">
							<div className="contrib-panel-header">
								<h2 className="contrib-panel-title">{selectedProject.projectName}</h2>
								<button
									className="contrib-panel-close"
									onClick={() => presenter.closePanel()}
									aria-label="Close"
								>
									✕
								</button>
							</div>

							{/* Add entry form */}
							<div className="contrib-entry-form">
								<input
									className={`contrib-input contrib-input-hours ${addHoursInvalid ? "is-invalid" : ""}`}
									type="number"
									min="0"
									step="0.25"
									placeholder="Hours"
									value={newEntryHours}
									onChange={(e) => setNewEntryHours(e.target.value)}
								/>
								<AutoTextarea
									className="contrib-input contrib-input-desc"
									placeholder="What did you work on?"
									value={newEntryDescription}
									onChange={(e) => setNewEntryDescription(e.target.value)}
								/>
								<button className="btn contrib-btn" onClick={() => void presenter.addEntry()}>
									Add Entry
								</button>
							</div>

							{/* Entries list — blank while loading, then animates in */}
							<div className="contrib-entries">
								{loadingEntries ? null : entries.length === 0 ? (
									<p className="contrib-empty">No contributions yet. Add your first entry above.</p>
								) : (
									entries.map((entry, index) => {
										const isRemoving = removingEntryIds.includes(entry.contributionId);
										// Staircase the arrival, most recent (top) first. A staggered
										// delay must not apply to the exit, or removal would lag.
										const stagger = isRemoving
											? undefined
											: ({ animationDelay: `${Math.min(index, 15) * 0.05}s` } as CSSProperties);
										return (
											<ContributionEntry
												key={entry.contributionId}
												entry={entry}
												style={stagger}
												isRemoving={isRemoving}
												onRemoved={() => void presenter.finalizeDeleteEntry(entry)}
												isEditing={editingEntryId === entry.contributionId}
												editHours={editHours}
												editDescription={editDescription}
												editHoursInvalid={editHoursInvalid}
												onEditHoursChange={setEditHours}
												onEditDescriptionChange={setEditDescription}
												onStartEdit={() => presenter.startEditEntry(entry)}
												onSaveEdit={() => void presenter.saveEditEntry(entry)}
												onCancelEdit={() => presenter.cancelEditEntry()}
												onDelete={() => presenter.requestDeleteEntry(entry)}
											/>
										);
									})
								)}
							</div>
						</div>
					)}
				</section>
			</main>

			{/* Edit-project modal */}
			{editingProject && (
				<div className="contrib-modal-overlay" onClick={() => setEditingProject(null)}>
					<div className="contrib-modal" onClick={(e) => e.stopPropagation()}>
						<h3 className="contrib-modal-title">Edit project</h3>
						<input
							className="contrib-input"
							type="text"
							value={editingProject.name}
							style={{ borderColor: editingProject.color }}
							onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
							onKeyDown={(e) => {
								if (e.key === "Enter") void presenter.saveEditProject();
								if (e.key === "Escape") setEditingProject(null);
							}}
							autoFocus
						/>
						<div className="contrib-swatches">
							{PRESET_COLORS.map((color: string) => (
								<button
									key={color}
									className={`contrib-swatch ${editingProject.color === color ? "is-active" : ""}`}
									style={{ background: color }}
									aria-label={`Pick color ${color}`}
									onClick={() => setEditingProject({ ...editingProject, color })}
								/>
							))}
						</div>
						<div className="contrib-modal-actions">
							<button
								className="btn contrib-btn contrib-btn-ghost"
								onClick={() => setEditingProject(null)}
							>
								Cancel
							</button>
							<button className="btn contrib-btn" onClick={() => void presenter.saveEditProject()}>
								Save
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Delete-confirmation modal */}
			{confirmState && (
				<div className="contrib-modal-overlay" onClick={() => setConfirmState(null)}>
					<div className="contrib-modal contrib-modal-confirm" onClick={(e) => e.stopPropagation()}>
						<h3 className="contrib-modal-title">{confirmState.title}</h3>
						<p className="contrib-modal-message">{confirmState.message}</p>
						<div className="contrib-modal-actions">
							<button className="btn contrib-btn contrib-btn-ghost" onClick={() => setConfirmState(null)}>
								Cancel
							</button>
							<button className="btn contrib-btn contrib-btn-danger" onClick={confirmState.onConfirm}>
								{confirmState.confirmLabel}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default ProjectContributions;
