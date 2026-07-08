import { Clipboard, Home, Lightbulb, Lock, Settings, Tv, Video } from 'lucide-react';
import { memo } from 'react';
import { type Section, useNavigation } from '../contexts/navigation-context';
import { useTheme } from '../contexts/theme-context';

export const Sidebar = memo(function Sidebar() {
	const { theme } = useTheme();
	const { activeSection, setActiveSection } = useNavigation();

	const bgColor = theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#0a0a0a] border-white/5';
	const activeColor = 'bg-orange-500/20 text-orange-500';
	const inactiveColor =
		theme === 'light' ? 'text-gray-400 hover:text-gray-900' : 'text-gray-600 hover:text-gray-400';

	const menuItems = [
		{
			icon: Home,
			label: 'Home',
			section: 'home' as Section,
			onClick: () => setActiveSection('home'),
		},
		{
			icon: Video,
			label: 'Security',
			section: 'security' as Section,
			onClick: () => setActiveSection('security'),
		},
		{
			icon: Clipboard,
			label: 'Tasks',
			section: 'tasks' as Section,
			onClick: () => setActiveSection('tasks'),
		},
		{
			icon: Lock,
			label: 'Locks',
			section: 'locks' as Section,
			onClick: () => setActiveSection('locks'),
		},
		{
			icon: Lightbulb,
			label: 'Lights',
			section: 'lights' as Section,
			onClick: () => setActiveSection('lights'),
		},
		{
			icon: Tv,
			label: 'Media',
			section: 'media' as Section,
			onClick: () => setActiveSection('media'),
		},
		{
			icon: Settings,
			label: 'Settings',
			section: 'settings' as Section,
			onClick: () => setActiveSection('settings'),
		},
	];

	return (
		<>
			{/* Desktop Sidebar */}
			<div
				className={`fixed left-0 top-0 h-full w-16 ${bgColor} border-r flex-col items-center py-6 gap-4 hidden md:flex z-50`}
			>
				<div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center mb-4">
					<Home className="w-6 h-6 text-white" />
				</div>

				{menuItems.map((item, index) => (
					<button
						key={index}
						onClick={item.onClick}
						className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
							item.section && activeSection === item.section ? activeColor : inactiveColor
						}`}
					>
						<item.icon className="w-5 h-5" />
					</button>
				))}
			</div>

			{/* Mobile Bottom Navigation */}
			<div
				className={`fixed bottom-0 left-0 right-0 ${bgColor} border-t flex md:hidden justify-around items-center px-2 py-2 z-50 safe-area-pb`}
			>
				{[menuItems[0], menuItems[1], menuItems[4], menuItems[5], menuItems[6]].map(
					(item, index) => (
						<button
							key={index}
							onClick={item.onClick}
							className={`flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-colors ${
								item.section && activeSection === item.section ? activeColor : inactiveColor
							}`}
						>
							<item.icon className="w-5 h-5" />
							<span className="text-[10px] font-medium">{item.label}</span>
						</button>
					)
				)}
			</div>
		</>
	);
});
