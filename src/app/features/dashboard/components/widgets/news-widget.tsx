import { Clock, ExternalLink, Newspaper } from 'lucide-react';
import { useTheme } from '@/app/contexts/theme-context';

interface NewsArticle {
	id: string;
	title: string;
	source: string;
	time: string;
	category: string;
	image?: string;
}

const mockArticles: NewsArticle[] = [
	{
		id: '1',
		title: 'SpaceX launches new satellite constellation',
		source: 'TechCrunch',
		time: '2h ago',
		category: 'Technology',
	},
	{
		id: '2',
		title: 'Global climate summit reaches historic agreement',
		source: 'Reuters',
		time: '4h ago',
		category: 'Environment',
	},
	{
		id: '3',
		title: 'New AI breakthrough in medical diagnostics',
		source: 'Science Daily',
		time: '6h ago',
		category: 'Science',
	},
	{
		id: '4',
		title: 'Markets hit record highs amid economic recovery',
		source: 'Bloomberg',
		time: '8h ago',
		category: 'Finance',
	},
	{
		id: '5',
		title: 'Olympic games announce new sustainability measures',
		source: 'ESPN',
		time: '10h ago',
		category: 'Sports',
	},
];

interface NewsWidgetProps {
	size?: 'small' | 'medium' | 'large';
}

export function NewsWidget({ size = 'large' }: NewsWidgetProps) {
	const { theme, primaryColor } = useTheme();

	const bgColor =
		theme === 'light' ? 'bg-white/70' : theme === 'contrast' ? 'bg-black/50' : 'bg-white/10';
	const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-white';
	const textSecondary =
		theme === 'light' ? 'text-gray-600' : theme === 'contrast' ? 'text-gray-300' : 'text-gray-400';
	const border = theme === 'light' ? 'border-gray-200/50' : 'border-white/10';
	const dividerColor = theme === 'light' ? 'border-gray-200' : 'border-white/10';

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

	const displayArticles =
		size === 'small'
			? mockArticles.slice(0, 2)
			: size === 'medium'
				? mockArticles.slice(0, 3)
				: mockArticles;

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
					<Newspaper className="w-5 h-5" />
				</div>
				<div className="flex-1 min-w-0">
					<h3 className={`text-sm font-semibold ${textPrimary}`}>News Feed</h3>
					<p className={`text-xs ${textSecondary}`}>Latest headlines</p>
				</div>
			</div>

			{/* Articles List */}
			<div className="flex-1 space-y-3 overflow-y-auto">
				{displayArticles.map((article, index) => (
					<div key={article.id}>
						<div className="flex items-start gap-3 group cursor-pointer">
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 mb-1">
									<span
										className="text-xs font-medium px-2 py-0.5 rounded"
										style={{
											backgroundColor: `${getColorValue(primaryColor)}20`,
											color: getColorValue(primaryColor),
										}}
									>
										{article.category}
									</span>
								</div>
								<p
									className={`text-sm font-medium ${textPrimary} mb-1 group-hover:underline line-clamp-2`}
								>
									{article.title}
								</p>
								<div className="flex items-center gap-2">
									<p className={`text-xs ${textSecondary}`}>{article.source}</p>
									<span className={`text-xs ${textSecondary}`}>•</span>
									<div className="flex items-center gap-1">
										<Clock className={`w-3 h-3 ${textSecondary}`} />
										<p className={`text-xs ${textSecondary}`}>{article.time}</p>
									</div>
								</div>
							</div>
							<ExternalLink
								className={`w-4 h-4 ${textSecondary} opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0`}
							/>
						</div>
						{index < displayArticles.length - 1 && (
							<div className={`border-t ${dividerColor} mt-3`} />
						)}
					</div>
				))}
			</div>

			{size !== 'small' && (
				<button
					type="button"
					className={`mt-4 w-full py-2 rounded-lg text-xs font-medium transition-colors ${textSecondary}`}
					style={{ backgroundColor: theme === 'light' ? '#f3f4f6' : 'rgba(255, 255, 255, 0.05)' }}
				>
					View All News
				</button>
			)}
		</div>
	);
}
