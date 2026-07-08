import { Check, Edit2, StickyNote } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../../contexts/theme-context';

interface NoteWidgetProps {
	size?: 'small' | 'medium' | 'large';
	initialNote?: string;
	onNoteChange?: (note: string) => void;
}

export function NoteWidget({ initialNote = '', onNoteChange }: Omit<NoteWidgetProps, 'size'>) {
	const { theme, primaryColor } = useTheme();
	const [note, setNote] = useState(initialNote || 'Click to add a note...');
	const [isEditing, setIsEditing] = useState(false);
	const [tempNote, setTempNote] = useState(note);

	const bgColor =
		theme === 'light' ? 'bg-white/70' : theme === 'contrast' ? 'bg-black/50' : 'bg-white/10';
	const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-white';
	const textSecondary =
		theme === 'light' ? 'text-gray-600' : theme === 'contrast' ? 'text-gray-300' : 'text-gray-400';
	const border = theme === 'light' ? 'border-gray-200/50' : 'border-white/10';

	const getColorValue = (color: string) => {
		const colors: Record<string, string> = {
			blue: '#007AFF',
			purple: '#AF52DE',
			pink: '#FF2D55',
			red: '#FF3B30',
			orange: '#FF9500',
			yellow: '#FFCC00',
			green: '#34C759',
			teal: '#5AC8FA',
		};
		return colors[color] || colors.blue;
	};

	const handleStartEdit = () => {
		setTempNote(note);
		setIsEditing(true);
	};

	const handleSave = () => {
		setNote(tempNote);
		setIsEditing(false);
		if (onNoteChange) {
			onNoteChange(tempNote);
		}
	};

	const handleCancel = () => {
		setTempNote(note);
		setIsEditing(false);
	};

	return (
		<div
			className={`${bgColor} backdrop-blur-xl rounded-2xl p-4 border ${border} h-full flex flex-col`}
		>
			{/* Header */}
			<div className="flex items-center gap-3 mb-4">
				<div
					className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
					style={{
						backgroundColor: `${getColorValue(primaryColor)}20`,
						color: getColorValue(primaryColor),
					}}
				>
					<StickyNote className="w-5 h-5" />
				</div>
				<div className="flex-1 min-w-0">
					<h3 className={`text-sm font-semibold ${textPrimary}`}>Quick Note</h3>
				</div>
				{!isEditing && (
					<button
						type="button"
						onClick={handleStartEdit}
						className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
						style={{ backgroundColor: theme === 'light' ? '#f3f4f6' : 'rgba(255, 255, 255, 0.05)' }}
					>
						<Edit2 className={`w-4 h-4 ${textSecondary}`} />
					</button>
				)}
			</div>

			{/* Note Content */}
			<div className="flex-1 flex flex-col">
				{isEditing ? (
					<>
						<textarea
							value={tempNote}
							onChange={(e) => setTempNote(e.target.value)}
							className={`flex-1 p-3 rounded-xl text-sm resize-none focus:outline-none ${textPrimary}`}
							style={{
								backgroundColor: theme === 'light' ? '#f3f4f6' : 'rgba(255, 255, 255, 0.05)',
								border: `2px solid ${getColorValue(primaryColor)}`,
							}}
							placeholder="Write your note here..."
						/>
						<div className="flex gap-2 mt-3">
							<button
								type="button"
								onClick={handleCancel}
								className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${textSecondary}`}
								style={{
									backgroundColor: theme === 'light' ? '#f3f4f6' : 'rgba(255, 255, 255, 0.05)',
								}}
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleSave}
								className="flex-1 py-2 rounded-lg text-xs font-medium text-white transition-colors"
								style={{ backgroundColor: getColorValue(primaryColor) }}
							>
								<div className="flex items-center justify-center gap-1">
									<Check className="w-3 h-3" />
									<span>Save</span>
								</div>
							</button>
						</div>
					</>
				) : (
					<button
						type="button"
						onClick={handleStartEdit}
						className={`flex-1 p-3 rounded-xl text-sm cursor-pointer transition-colors text-left ${
							note === 'Click to add a note...' ? textSecondary : textPrimary
						}`}
						style={{ backgroundColor: theme === 'light' ? '#f3f4f6' : 'rgba(255, 255, 255, 0.05)' }}
					>
						<p className="whitespace-pre-wrap">{note}</p>
					</button>
				)}
			</div>
		</div>
	);
}
