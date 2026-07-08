import { Home, Pause, Play, Settings } from 'lucide-react';

interface VacuumControlsLargeProps {
	currentStatus: 'cleaning' | 'returning' | 'docked' | 'paused' | 'idle';
	onStartCleaning: () => void;
	onPause: () => void;
	onReturnHome: () => void;
	onOpenSettings: () => void;
	theme: 'light' | 'dark' | 'contrast';
}

export function VacuumControlsLarge({
	currentStatus,
	onStartCleaning,
	onPause,
	onReturnHome,
	onOpenSettings,
	theme,
}: VacuumControlsLargeProps) {
	const btnBg =
		theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-white/10 hover:bg-white/20';
	const btnText = theme === 'light' ? 'text-gray-700' : 'text-gray-300';

	return (
		<div className="flex items-center gap-4">
			<div className="flex items-center gap-3">
				{currentStatus === 'cleaning' ? (
					<button
						type="button"
						onClick={onPause}
						className={`w-10 h-10 rounded-full ${btnBg} transition-colors flex items-center justify-center`}
					>
						<Pause className={`w-5 h-5 ${btnText}`} />
					</button>
				) : (
					<button
						type="button"
						onClick={onStartCleaning}
						className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors flex items-center justify-center shadow-lg shadow-blue-500/30"
					>
						<Play className="w-6 h-6 text-white" />
					</button>
				)}
				<button
					type="button"
					onClick={onReturnHome}
					className={`w-10 h-10 rounded-full ${btnBg} transition-colors flex items-center justify-center`}
				>
					<Home className={`w-5 h-5 ${btnText}`} />
				</button>
			</div>
			<button
				type="button"
				onClick={(e) => {
					e.stopPropagation();
					onOpenSettings();
				}}
				className={`w-10 h-10 rounded-full ${btnBg} transition-all flex items-center justify-center`}
			>
				<Settings className={`w-5 h-5 ${btnText}`} />
			</button>
		</div>
	);
}
