import { Bell } from 'lucide-react';

interface NotificationEmptyStateProps {
	theme: 'light' | 'dark' | 'contrast';
}

export function NotificationEmptyState({ theme }: NotificationEmptyStateProps) {
	const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-white';
	const textMuted = theme === 'light' ? 'text-gray-500' : 'text-gray-500';
	const itemBg =
		theme === 'light' ? 'bg-gray-50' : theme === 'contrast' ? 'bg-black/30' : 'bg-white/5';

	return (
		<div className="p-8 text-center">
			<div
				className={`w-16 h-16 mx-auto mb-3 rounded-full ${itemBg} flex items-center justify-center`}
			>
				<Bell className={`w-8 h-8 ${textMuted}`} />
			</div>
			<p className={`text-sm font-medium ${textPrimary} mb-1`}>No notifications</p>
			<p className={`text-xs ${textMuted}`}>You're all caught up!</p>
		</div>
	);
}
