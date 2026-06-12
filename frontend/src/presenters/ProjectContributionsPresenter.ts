import type { Dispatch, MutableRefObject, SetStateAction } from "react";
import { serverFacade } from "../net/ServerFacade";
import type { Contribution, ProjectSummary } from "../net/IServerFacade";

export const PRESET_COLORS = ["#22b538", "#2f6feb", "#e0457b", "#f5a524", "#7c5cff", "#14b8a6", "#ef4444", "#0ea5e9"];
export const DEFAULT_COLOR: string = PRESET_COLORS[0]!;

/** Name of the panel's CSS exit animation; used to finalize the close. */
export const CLOSE_ANIMATION = "contrib-panel-close";

/** Formats a minutes value (e.g. 75) as a readable duration (e.g. "1h 15m"). */
export function formatMinutes(totalMinutes: number): string {
	const h = Math.floor(totalMinutes / 60);
	const m = totalMinutes % 60;
	if (h === 0) return `${m}m`;
	if (m === 0) return `${h}h`;
	return `${h}h ${m}m`;
}

/** Parses an hours input (e.g. "1.25") into minutes rounded to the nearest 15. */
export function parseHoursToMinutes(raw: string): number | null {
	const hours = parseFloat(raw);
	if (isNaN(hours) || hours <= 0) return null;
	const minutes = Math.round((hours * 60) / 15) * 15;
	return minutes > 0 ? minutes : null;
}

/** Whether an hours input currently holds a negative value (for red highlight). */
export function isNegativeHours(raw: string): boolean {
	return raw.trim() !== "" && Number(raw) < 0;
}

export interface ConfirmState {
	title: string;
	message: string;
	confirmLabel: string;
	onConfirm: () => void;
}

export interface EditingProject {
	originalName: string;
	originalColor: string;
	name: string;
	color: string;
}

/**
 * The slice of component state and setters the presenter needs to read from and
 * write to. The component owns the state (via `useState`/`useRef`) and exposes
 * it here; the presenter owns all of the behavior that acts on it.
 */
export interface ProjectContributionsView {
	// --- Reads ---
	projects: ProjectSummary[];
	selectedName: string | null;
	isClosing: boolean;
	selectedNameRef: MutableRefObject<string | null>;
	newProjectName: string;
	newProjectColor: string;
	newEntryHours: string;
	newEntryDescription: string;
	editHours: string;
	editDescription: string;
	editingProject: EditingProject | null;

	// --- Writes ---
	setProjects: Dispatch<SetStateAction<ProjectSummary[]>>;
	setLoadingProjects: Dispatch<SetStateAction<boolean>>;
	setError: Dispatch<SetStateAction<string | null>>;
	setSelectedName: Dispatch<SetStateAction<string | null>>;
	setIsClosing: Dispatch<SetStateAction<boolean>>;
	setEntries: Dispatch<SetStateAction<Contribution[]>>;
	setLoadingEntries: Dispatch<SetStateAction<boolean>>;
	setShowProjectForm: Dispatch<SetStateAction<boolean>>;
	setNewProjectName: Dispatch<SetStateAction<string>>;
	setNewProjectColor: Dispatch<SetStateAction<string>>;
	setNewEntryHours: Dispatch<SetStateAction<string>>;
	setNewEntryDescription: Dispatch<SetStateAction<string>>;
	setEditingEntryId: Dispatch<SetStateAction<string | null>>;
	setEditHours: Dispatch<SetStateAction<string>>;
	setEditDescription: Dispatch<SetStateAction<string>>;
	setEditingProject: Dispatch<SetStateAction<EditingProject | null>>;
	setConfirmState: Dispatch<SetStateAction<ConfirmState | null>>;
	setRemovingEntryIds: Dispatch<SetStateAction<string[]>>;
	setRemovingProjectNames: Dispatch<SetStateAction<string[]>>;
	setJustAddedName: Dispatch<SetStateAction<string | null>>;
	setPageStart: Dispatch<SetStateAction<number>>;
}

/**
 * Presenter for the Project Contributions view. Holds all of the loading,
 * mutation, and validation behavior so the component stays a thin renderer.
 *
 * The presenter reads the latest state through `getView()` (re-derived on every
 * render by the component) so its own identity can stay stable across renders.
 */
export class ProjectContributionsPresenter {
	constructor(private readonly getView: () => ProjectContributionsView) {}

	private get view(): ProjectContributionsView {
		return this.getView();
	}

	/** The currently selected project, or null if none/unknown. */
	get selectedProject(): ProjectSummary | null {
		const { projects, selectedName } = this.view;
		return projects.find((p) => p.projectName === selectedName) ?? null;
	}

	// Oldest first so the most recently created project always sits at the end,
	// right before the "New Project" card. Falls back to name for ties / when a
	// createdAt is missing (e.g. legacy rows).
	private sortByCreated(list: ProjectSummary[]): ProjectSummary[] {
		return [...list].sort(
			(a, b) =>
				(a.createdAt || "").localeCompare(b.createdAt || "") || a.projectName.localeCompare(b.projectName),
		);
	}

	private sortEntries(list: Contribution[]): Contribution[] {
		return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
	}

	private message(err: unknown, fallback: string): string {
		return err instanceof Error ? err.message : fallback;
	}

	// --- Loading ---------------------------------------------------------

	/** Loads the project roster. Returns a cleanup that cancels pending updates. */
	loadProjects(): () => void {
		const view = this.view;
		let cancelled = false;
		serverFacade
			.listProjects()
			.then((list) => {
				if (!cancelled) view.setProjects(this.sortByCreated(list));
			})
			.catch((err: unknown) => {
				if (!cancelled) view.setError(this.message(err, "Failed to load projects"));
			})
			.finally(() => {
				if (!cancelled) view.setLoadingProjects(false);
			});
		return () => {
			cancelled = true;
		};
	}

	/** Loads a project's entries. Returns a cleanup that cancels pending updates. */
	loadContributions(projectName: string): () => void {
		const view = this.view;
		let cancelled = false;
		view.setLoadingEntries(true);
		view.setEntries([]);
		view.setEditingEntryId(null);
		serverFacade
			.listContributions(projectName)
			.then((list) => {
				if (!cancelled) view.setEntries(this.sortEntries(list));
			})
			.catch((err: unknown) => {
				if (!cancelled) view.setError(this.message(err, "Failed to load contributions"));
			})
			.finally(() => {
				if (!cancelled) view.setLoadingEntries(false);
			});
		return () => {
			cancelled = true;
		};
	}

	// Re-pull a project's entries + aggregates after a failed optimistic change.
	private async resyncEntries(projectName: string): Promise<void> {
		const view = this.view;
		try {
			const [list, fresh] = await Promise.all([
				serverFacade.listContributions(projectName),
				serverFacade.listProjects(),
			]);
			view.setProjects(this.sortByCreated(fresh));
			if (view.selectedNameRef.current === projectName) view.setEntries(this.sortEntries(list));
		} catch {
			/* leave the error message in place */
		}
	}

	// --- Panel navigation ------------------------------------------------

	closePanel(): void {
		if (this.view.selectedName) this.view.setIsClosing(true);
	}

	// Finalize the close only after the exit animation has run to completion.
	handlePanelAnimationEnd(animationName: string): void {
		const view = this.view;
		if (animationName === CLOSE_ANIMATION && view.isClosing) {
			view.setSelectedName(null);
			view.setIsClosing(false);
			view.setEntries([]);
		}
	}

	selectProject(name: string): void {
		const view = this.view;
		if (view.selectedName === name && !view.isClosing) {
			this.closePanel();
			return;
		}
		view.setIsClosing(false);
		view.setSelectedName(name);
	}

	// --- New project form ------------------------------------------------

	cancelProjectForm(): void {
		const view = this.view;
		view.setShowProjectForm(false);
		view.setNewProjectName("");
		view.setNewProjectColor(DEFAULT_COLOR);
	}

	async addProject(): Promise<void> {
		const view = this.view;
		const name = view.newProjectName.trim();
		if (!name) return;
		if (view.projects.some((p) => p.projectName === name)) {
			view.setError(`A project named "${name}" already exists`);
			return;
		}
		view.setError(null);
		const created = await serverFacade
			.createProject({ projectName: name, color: view.newProjectColor })
			.catch((err: unknown) => {
				view.setError(this.message(err, "Failed to create project"));
				return null;
			});
		if (!created) return;
		// Guard against an older backend that omitted these: a fresh project has
		// no contributions, and it should sort to the end by creation time.
		const summary: ProjectSummary = {
			...created,
			entryCount: created.entryCount ?? 0,
			totalMinutes: created.totalMinutes ?? 0,
			createdAt: created.createdAt || new Date().toISOString(),
		};
		view.setProjects((prev) => this.sortByCreated([...prev, summary]));
		this.cancelProjectForm();
		view.setIsClosing(false);
		view.setSelectedName(summary.projectName);
		// Flag it so its card plays the "grow into place" animation, and page the
		// carousel to the end so the new card is visible (clamped on render).
		view.setJustAddedName(summary.projectName);
		view.setPageStart(Number.MAX_SAFE_INTEGER);
	}

	// Clear the "just added" flag once the card's grow-in animation has played.
	clearJustAdded(): void {
		this.view.setJustAddedName(null);
	}

	// --- Entries ---------------------------------------------------------

	async addEntry(): Promise<void> {
		const view = this.view;
		const selectedProject = this.selectedProject;
		if (!selectedProject) return;
		const projectName = selectedProject.projectName;
		const description = view.newEntryDescription.trim();
		const minutes = parseHoursToMinutes(view.newEntryHours);
		if (!description || minutes === null) return;
		// Clear the form immediately; the entry animates in once the server replies.
		view.setNewEntryHours("");
		view.setNewEntryDescription("");
		view.setError(null);
		try {
			const created = await serverFacade.createContribution(projectName, {
				timeSpentMinutes: minutes,
				description,
			});
			view.setProjects((prev) =>
				prev.map((p) =>
					p.projectName === projectName
						? { ...p, entryCount: p.entryCount + 1, totalMinutes: p.totalMinutes + minutes }
						: p,
				),
			);
			if (view.selectedNameRef.current === projectName) {
				view.setEntries((prev) => [created, ...prev]);
			}
		} catch (err: unknown) {
			view.setError(this.message(err, "Failed to add entry"));
		}
	}

	startEditEntry(entry: Contribution): void {
		const view = this.view;
		view.setEditingEntryId(entry.contributionId);
		view.setEditHours(String(entry.timeSpentMinutes / 60));
		view.setEditDescription(entry.description);
	}

	cancelEditEntry(): void {
		this.view.setEditingEntryId(null);
	}

	async saveEditEntry(entry: Contribution): Promise<void> {
		const view = this.view;
		const description = view.editDescription.trim();
		const minutes = parseHoursToMinutes(view.editHours);
		if (!description || minutes === null) return;
		// Nothing changed — just close the editor without hitting the server.
		if (minutes === entry.timeSpentMinutes && description === entry.description) {
			view.setEditingEntryId(null);
			return;
		}
		const delta = minutes - entry.timeSpentMinutes;
		const projectName = entry.projectName;
		view.setEditingEntryId(null);
		view.setError(null);
		// Optimistic update.
		view.setEntries((prev) =>
			prev.map((e) =>
				e.contributionId === entry.contributionId ? { ...e, timeSpentMinutes: minutes, description } : e,
			),
		);
		view.setProjects((prev) =>
			prev.map((p) => (p.projectName === projectName ? { ...p, totalMinutes: p.totalMinutes + delta } : p)),
		);
		try {
			await serverFacade.updateContribution(projectName, entry.contributionId, {
				timeSpentMinutes: minutes,
				description,
			});
		} catch (err: unknown) {
			view.setError(this.message(err, "Failed to update entry"));
			void this.resyncEntries(projectName);
		}
	}

	requestDeleteEntry(entry: Contribution): void {
		this.view.setConfirmState({
			title: "Delete contribution",
			message: "Delete this contribution? This can't be undone.",
			confirmLabel: "Delete",
			onConfirm: () => void this.doDeleteEntry(entry),
		});
	}

	// Flag the entry as removing so its card plays the fade-out animation. The
	// actual removal + server call happens in `finalizeDeleteEntry` once the
	// animation ends.
	private doDeleteEntry(entry: Contribution): void {
		const view = this.view;
		view.setConfirmState(null);
		view.setRemovingEntryIds((prev) =>
			prev.includes(entry.contributionId) ? prev : [...prev, entry.contributionId],
		);
	}

	// Called when the entry's fade-out animation finishes: remove it for real.
	async finalizeDeleteEntry(entry: Contribution): Promise<void> {
		const view = this.view;
		const projectName = entry.projectName;
		view.setError(null);
		view.setRemovingEntryIds((prev) => prev.filter((id) => id !== entry.contributionId));
		// Optimistic removal.
		view.setEntries((prev) => prev.filter((e) => e.contributionId !== entry.contributionId));
		view.setProjects((prev) =>
			prev.map((p) =>
				p.projectName === projectName
					? {
							...p,
							entryCount: Math.max(0, p.entryCount - 1),
							totalMinutes: Math.max(0, p.totalMinutes - entry.timeSpentMinutes),
						}
					: p,
			),
		);
		try {
			await serverFacade.deleteContribution(projectName, entry.contributionId);
		} catch (err: unknown) {
			view.setError(this.message(err, "Failed to delete entry"));
			void this.resyncEntries(projectName);
		}
	}

	// --- Project edit / delete ------------------------------------------

	openEditProject(project: ProjectSummary): void {
		this.view.setEditingProject({
			originalName: project.projectName,
			originalColor: project.color || DEFAULT_COLOR,
			name: project.projectName,
			color: project.color || DEFAULT_COLOR,
		});
	}

	async saveEditProject(): Promise<void> {
		const view = this.view;
		const editingProject = view.editingProject;
		if (!editingProject) return;
		const name = editingProject.name.trim();
		if (!name) return;
		const original = editingProject.originalName;
		const renamed = name !== original;
		const colorChanged = editingProject.color !== editingProject.originalColor;
		// Nothing changed — just close the modal without hitting the server.
		if (!renamed && !colorChanged) {
			view.setEditingProject(null);
			return;
		}
		if (renamed && view.projects.some((p) => p.projectName === name)) {
			view.setError(`A project named "${name}" already exists`);
			return;
		}
		view.setError(null);
		const updated = await serverFacade
			.updateProject(original, { newName: renamed ? name : undefined, color: editingProject.color })
			.catch((err: unknown) => {
				view.setError(this.message(err, "Failed to update project"));
				return null;
			});
		if (!updated) return;
		view.setProjects((prev) => this.sortByCreated(prev.map((p) => (p.projectName === original ? updated : p))));
		if (view.selectedNameRef.current === original) view.setSelectedName(updated.projectName);
		view.setEditingProject(null);
	}

	requestDeleteProject(project: ProjectSummary): void {
		this.view.setConfirmState({
			title: "Delete project",
			message: `Delete "${project.projectName}" and all ${project.entryCount} ${
				project.entryCount === 1 ? "contribution" : "contributions"
			}? This can't be undone.`,
			confirmLabel: "Delete project",
			onConfirm: () => void this.doDeleteProject(project),
		});
	}

	// Flag the project as removing so its card plays the fade-out animation. The
	// actual removal + server call happens in `finalizeDeleteProject` once the
	// animation ends.
	private doDeleteProject(project: ProjectSummary): void {
		const view = this.view;
		view.setConfirmState(null);
		view.setRemovingProjectNames((prev) =>
			prev.includes(project.projectName) ? prev : [...prev, project.projectName],
		);
	}

	// Called when the card's fade-out animation finishes: remove it for real.
	async finalizeDeleteProject(project: ProjectSummary): Promise<void> {
		const view = this.view;
		view.setError(null);
		view.setRemovingProjectNames((prev) => prev.filter((n) => n !== project.projectName));
		const wasSelected = view.selectedName === project.projectName;
		view.setProjects((prev) => prev.filter((p) => p.projectName !== project.projectName));
		if (wasSelected) {
			view.setSelectedName(null);
			view.setIsClosing(false);
			view.setEntries([]);
		}
		try {
			await serverFacade.deleteProject(project.projectName);
		} catch (err: unknown) {
			view.setError(this.message(err, "Failed to delete project"));
			const fresh = await serverFacade.listProjects().catch(() => null);
			if (fresh) view.setProjects(this.sortByCreated(fresh));
		}
	}
}
