import { LevelCellProps } from "./types";

export function LevelCell({ calculation, renderCell }: LevelCellProps) {
	return renderCell(
		true,
		<span className="text-sm font-mono">{calculation.level || 1}</span>,
		"level"
	);
}

export function AddLevelCell({ renderCell }: { renderCell: LevelCellProps['renderCell'] }) {
	return renderCell(
		true,
		<span className="text-xs font-mono">New</span>,
		"level"
	);
} 