import { type CSSProperties } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import type { Contribution } from "../../net/IServerFacade";
import { formatMinutes } from "../../presenters/ProjectContributionsPresenter";
import AutoTextarea from "./AutoTextarea";

/**
 * Splits a line on backtick-delimited spans, rendering each `like this`
 * run as an inline <code> chip. An unmatched trailing backtick is treated
 * as literal text so half-typed input still reads cleanly.
 */
function renderInline(text: string, keyPrefix: string): React.ReactNode {
	const parts: React.ReactNode[] = [];
	const regex = /`([^`]+)`/g;
	let lastIndex = 0;
	let match: RegExpExecArray | null;
	while ((match = regex.exec(text)) !== null) {
		if (match.index > lastIndex) {
			parts.push(text.slice(lastIndex, match.index));
		}
		parts.push(
			<code key={`${keyPrefix}-code-${match.index}`} className="contrib-entry-code">
				{match[1]}
			</code>,
		);
		lastIndex = regex.lastIndex;
	}
	if (lastIndex < text.length) {
		parts.push(text.slice(lastIndex));
	}
	return parts;
}

/**
 * Renders a description, turning runs of lines that start with "-" into a
 * bulleted list and keeping the remaining lines as plain text. Inline
 * `backtick` spans become code chips in either form.
 */
function renderDescription(text: string): React.ReactNode {
	const nodes: React.ReactNode[] = [];
	let bullets: string[] = [];
	const flushBullets = () => {
		if (bullets.length === 0) return;
		nodes.push(
			<ul key={`ul-${nodes.length}`} className="contrib-entry-list">
				{bullets.map((item, i) => (
					<li key={i}>{renderInline(item, `ul-${nodes.length}-${i}`)}</li>
				))}
			</ul>,
		);
		bullets = [];
	};

	text.split("\n").forEach((line, i) => {
		const bullet = line.match(/^\s*-\s?(.*)$/);
		if (bullet) {
			bullets.push(bullet[1] ?? "");
		} else {
			flushBullets();
			if (line.trim() !== "") {
				nodes.push(
					<span key={`t-${i}`} className="contrib-entry-text">
						{renderInline(line, `t-${i}`)}
					</span>,
				);
			}
		}
	});
	flushBullets();
	return nodes;
}

interface ContributionEntryProps {
	entry: Contribution;
	style?: CSSProperties;
	isRemoving: boolean;
	onRemoved: () => void;
	isEditing: boolean;
	editHours: string;
	editDescription: string;
	editHoursInvalid: boolean;
	onEditHoursChange: (value: string) => void;
	onEditDescriptionChange: (value: string) => void;
	onStartEdit: () => void;
	onSaveEdit: () => void;
	onCancelEdit: () => void;
	onDelete: () => void;
}

const ContributionEntry = ({
	entry,
	style,
	isRemoving,
	onRemoved,
	isEditing,
	editHours,
	editDescription,
	editHoursInvalid,
	onEditHoursChange,
	onEditDescriptionChange,
	onStartEdit,
	onSaveEdit,
	onCancelEdit,
	onDelete,
}: ContributionEntryProps) => {
	if (isEditing) {
		return (
			<div className="contrib-entry contrib-entry-editing" style={style}>
				<input
					className={`contrib-input contrib-input-hours ${editHoursInvalid ? "is-invalid" : ""}`}
					type="number"
					min="0"
					step="0.25"
					placeholder="Hours"
					value={editHours}
					onChange={(e) => onEditHoursChange(e.target.value)}
				/>
				<AutoTextarea
					className="contrib-input contrib-input-desc"
					value={editDescription}
					onChange={(e) => onEditDescriptionChange(e.target.value)}
					onKeyDown={(e) => {
						// Enter adds a new line; use the Save button to commit.
						if (e.key === "Escape") onCancelEdit();
					}}
					autoFocus
				/>
				<button className="btn contrib-btn" onClick={onSaveEdit}>
					Save
				</button>
				<button className="btn contrib-btn contrib-btn-ghost" onClick={onCancelEdit}>
					Cancel
				</button>
			</div>
		);
	}

	return (
		<div
			className={`contrib-entry ${isRemoving ? "contrib-entry-removing" : ""}`}
			style={style}
			onAnimationEnd={(e) => {
				if (e.animationName === "contrib-entry-out") onRemoved();
			}}
		>
			<span className="contrib-entry-time">{formatMinutes(entry.timeSpentMinutes)}</span>
			<div className="contrib-entry-desc">{renderDescription(entry.description)}</div>
			<div className="contrib-entry-actions">
				<button
					className="contrib-icon-btn contrib-icon-edit"
					onClick={onStartEdit}
					aria-label="Edit entry"
				>
					<FontAwesomeIcon icon={faPen} />
				</button>
				<button
					className="contrib-icon-btn contrib-icon-delete"
					onClick={onDelete}
					aria-label="Delete entry"
				>
					<FontAwesomeIcon icon={faTrash} />
				</button>
			</div>
		</div>
	);
};

export default ContributionEntry;
