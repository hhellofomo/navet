export const formatTimestamp = (date: Date): string => {
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);

	if (diffMins < 1) return 'Just now';
	if (diffMins < 60) return `${diffMins}m ago`;
	if (diffHours < 24) return `${diffHours}h ago`;
	return `${diffDays}d ago`;
};

export const getColorValue = (color: string): string => {
	const colors: Record<string, string> = {
		orange: '#f97316',
		blue: '#3b82f6',
		green: '#22c55e',
		purple: '#a855f7',
		pink: '#ec4899',
		red: '#ef4444',
		yellow: '#eab308',
		teal: '#14b8a6',
	};
	return colors[color] || colors.blue;
};
