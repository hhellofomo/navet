import * as Dialog from '@radix-ui/react-dialog';
import { Home, Play } from 'lucide-react';
import { DialogHeader } from '@/app/components/shared/dialog-header';

interface VacuumSettingsDialogProps {
	isOpen: boolean;
	onClose: () => void;
	name: string;
	theme: 'light' | 'dark' | 'contrast';
}

export function VacuumSettingsDialog({ isOpen, onClose, name, theme }: VacuumSettingsDialogProps) {
	const bgColor = theme === 'light' ? 'bg-white' : 'bg-gray-900';
	const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
	const borderColor = theme === 'light' ? 'border-gray-200' : 'border-white/10';

	return (
		<Dialog.Root open={isOpen} onOpenChange={onClose}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
				<Dialog.Content
					className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md rounded-2xl border ${borderColor} ${bgColor} shadow-2xl z-50 overflow-hidden`}
				>
					<DialogHeader title={`${name} Settings`} onClose={onClose} theme={theme} />

					<div className="p-6 space-y-6">
						{/* Cleaning Modes */}
						<div>
							<h3 className={`text-sm font-semibold ${textColor} mb-3`}>Cleaning Mode</h3>
							<div className="grid grid-cols-2 gap-2">
								{['Auto', 'Spot', 'Edge', 'Room'].map((mode) => (
									<button
										type="button"
										key={mode}
										className="py-3 rounded-xl text-sm font-medium transition-all border-2 border-white/10 bg-white/5 text-gray-300 hover:border-blue-500/50"
									>
										{mode}
									</button>
								))}
							</div>
						</div>

						{/* Fan Speed */}
						<div>
							<h3 className={`text-sm font-semibold ${textColor} mb-3`}>Fan Speed</h3>
							<div className="grid grid-cols-3 gap-2">
								{['Quiet', 'Standard', 'Max'].map((speed) => (
									<button
										type="button"
										key={speed}
										className="py-3 rounded-xl text-sm font-medium transition-all border-2 border-white/10 bg-white/5 text-gray-300 hover:border-blue-500/50"
									>
										{speed}
									</button>
								))}
							</div>
						</div>

						{/* Actions */}
						<div>
							<h3 className={`text-sm font-semibold ${textColor} mb-3`}>Actions</h3>
							<div className="space-y-2">
								<button
									type="button"
									className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
								>
									<Play className="w-4 h-4" />
									Start Cleaning
								</button>
								<button
									type="button"
									className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
								>
									<Home className="w-4 h-4" />
									Return to Dock
								</button>
							</div>
						</div>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
