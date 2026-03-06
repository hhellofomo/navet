import {
	ExternalLink,
	FileText,
	Github,
	Heart,
	Image as ImageIcon,
	Info,
	LogOut,
	Palette,
	Scale,
	Server,
	Settings2,
	X,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Switch } from '@/app/components/ui/switch';
import { useAuth } from '@/app/contexts/auth-context';
import { useConfig } from '@/app/contexts/config-context';
import { type ThemeType, useTheme } from '@/app/contexts/theme-context';
import { useSettingsStore, type PrimaryColor } from '@/app/stores';

export function SettingsSection() {
	const { theme, setTheme, primaryColor, setPrimaryColor, wallpaper, setWallpaper } = useTheme();
	const { logout, config } = useAuth();
	const { clearConfig } = useConfig();
	const disableAnimations = useSettingsStore((state) => state.disableAnimations);
	const updateSettings = useSettingsStore((state) => state.updateSettings);
	const [showLicense, setShowLicense] = useState(false);
	const [showTerms, setShowTerms] = useState(false);
	const [_showEditConnection, _setShowEditConnection] = useState(false);

	// Get color value for inline styles
	const getColorValue = (color: PrimaryColor): string => {
		const colors: Record<PrimaryColor, string> = {
			orange: '#f97316',
			blue: '#3b82f6',
			green: '#22c55e',
			purple: '#a855f7',
			pink: '#ec4899',
			red: '#ef4444',
			yellow: '#eab308',
			teal: '#14b8a6',
		};
		return colors[color];
	};

	const themeOptions: Array<{ value: ThemeType; label: string; description: string }> = [
		{
			value: 'dark',
			label: 'Dark',
			description: 'Subtle gradients with muted colors',
		},
		{
			value: 'light',
			label: 'Light',
			description: 'Bright pastels with soft accents',
		},
		{
			value: 'contrast',
			label: 'High Contrast',
			description: 'Vibrant colors for better visibility',
		},
	];

	const colorOptions: Array<{ value: PrimaryColor; label: string; color: string }> = [
		{ value: 'orange', label: 'Orange', color: '#f97316' },
		{ value: 'blue', label: 'Blue', color: '#3b82f6' },
		{ value: 'green', label: 'Green', color: '#22c55e' },
		{ value: 'purple', label: 'Purple', color: '#a855f7' },
		{ value: 'pink', label: 'Pink', color: '#ec4899' },
		{ value: 'red', label: 'Red', color: '#ef4444' },
		{ value: 'yellow', label: 'Yellow', color: '#eab308' },
		{ value: 'teal', label: 'Teal', color: '#14b8a6' },
	];

	const handleLogout = () => {
		if (confirm('Are you sure you want to logout?')) {
			logout();
			toast.success('Logged out successfully');
		}
	};

	const handleResetConnection = () => {
		if (
			confirm(
				'Are you sure you want to reset your smart home connection? You will need to reconnect.'
			)
		) {
			clearConfig();
			logout();
			toast.info('Connection reset. Please reconnect to your system.');
		}
	};

	const handleWallpaperUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		// Check if file is an image
		if (!file.type.startsWith('image/')) {
			alert('Please upload an image file');
			return;
		}

		// Check file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			alert('Image size should be less than 5MB');
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			const result = e.target?.result as string;
			setWallpaper(result);
		};
		reader.readAsDataURL(file);
	};

	const handleRemoveWallpaper = () => {
		setWallpaper(null);
	};

	// Theme colors
	const _bgColor = theme === 'light' ? 'bg-gray-50' : 'bg-[#0a0a0a]';
	const cardBg =
		theme === 'light' ? 'bg-white' : theme === 'contrast' ? 'bg-gray-950' : 'bg-gray-900';
	const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
	const mutedColor = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
	const subtleColor = theme === 'light' ? 'text-gray-500' : 'text-gray-500';
	const borderColor = theme === 'light' ? 'border-gray-200' : 'border-white/10';
	const hoverBg = theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-white/5';

	return (
		<div className="h-full overflow-y-auto p-4 md:p-6">
			<div className="max-w-2xl mx-auto space-y-4">
				{/* Header */}
				<div className="mb-6">
					<h1 className={`text-xl font-semibold ${textColor} mb-1`}>Settings</h1>
					<p className={`text-sm ${subtleColor}`}>Customize your dashboard</p>
				</div>

				{/* Appearance Section */}
				<section className={`${cardBg} rounded-2xl border ${borderColor} overflow-hidden`}>
					<div className="p-4 border-b border-white/10">
						<div className="flex items-center gap-3">
							<div
								className={`w-8 h-8 rounded-xl ${theme === 'light' ? 'bg-gray-100' : 'bg-white/5'} flex items-center justify-center`}
							>
								<Palette className={`w-4 h-4 ${mutedColor}`} />
							</div>
							<div>
								<h3 className={`text-sm font-semibold ${textColor}`}>Appearance</h3>
								<p className={`text-xs ${subtleColor}`}>Customize colors and theme</p>
							</div>
						</div>
					</div>

					<div className="p-4 space-y-5">
						{/* Theme Mode */}
						<div>
							<label htmlFor="theme-mode" className={`text-xs font-medium ${textColor} block mb-2`}>
								Theme Mode
							</label>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
								{themeOptions.map((option) => (
									<button
										type="button"
										key={option.value}
										onClick={() => setTheme(option.value)}
										className={`
                      p-3 rounded-xl border transition-all text-left
                      ${theme === option.value ? 'border-2' : `${borderColor} ${hoverBg}`}
                    `}
										style={
											theme === option.value
												? {
														backgroundColor: `${getColorValue(primaryColor)}1a`,
														borderColor: getColorValue(primaryColor),
													}
												: {}
										}
									>
										<div className="flex items-start justify-between gap-2">
											<div className="flex-1 min-w-0">
												<span
													className={`font-medium text-xs block mb-0.5 ${theme === option.value ? '' : textColor}`}
													style={
														theme === option.value ? { color: getColorValue(primaryColor) } : {}
													}
												>
													{option.label}
												</span>
												<p className={`text-[10px] ${mutedColor} leading-tight`}>
													{option.description}
												</p>
											</div>
											<div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
												{theme === option.value && (
													<div
														className="w-4 h-4 rounded-full flex items-center justify-center"
														style={{ backgroundColor: getColorValue(primaryColor) }}
													>
														<div className="w-1.5 h-1.5 rounded-full bg-white" />
													</div>
												)}
											</div>
										</div>
									</button>
								))}
							</div>
						</div>

						{/* Primary Color */}
						<div>
							<label
								htmlFor="primary-color"
								className={`text-xs font-medium ${textColor} block mb-2`}
							>
								Primary Color
							</label>
							<p className={`text-xs ${subtleColor} mb-3`}>
								Choose a color that will be used for active states throughout your dashboard
							</p>
							<div className="flex items-center gap-2.5">
								{colorOptions.map((option) => (
									<button
										type="button"
										key={option.value}
										onClick={() => setPrimaryColor(option.value)}
										className={`w-10 h-10 rounded-full transition-all duration-300 flex-shrink-0 ${
											primaryColor === option.value
												? `ring-2 ${theme === 'light' ? 'ring-black/30' : 'ring-white/40'} ring-offset-2 ${theme === 'light' ? 'ring-offset-white' : 'ring-offset-gray-900'}`
												: 'hover:scale-110'
										}`}
										style={{
											backgroundColor: option.color,
										}}
										title={option.label}
									/>
								))}
							</div>
						</div>

						{/* Background Wallpaper */}
						<div>
							<label htmlFor="wallpaper" className={`text-xs font-medium ${textColor} block mb-2`}>
								Background Wallpaper
							</label>
							<p className={`text-xs ${subtleColor} mb-3`}>
								Upload an image that will blend with your theme color for a harmonized look
							</p>

							{wallpaper ? (
								<div className="relative">
									<div
										className="w-full h-32 rounded-xl border overflow-hidden relative"
										style={{ borderColor: `${getColorValue(primaryColor)}40` }}
									>
										<img
											src={wallpaper}
											alt="Wallpaper preview"
											className="w-full h-full object-cover"
										/>
										<div
											className="absolute inset-0 bg-gradient-to-br"
											style={{
												background: `linear-gradient(135deg, ${getColorValue(primaryColor)}60, ${getColorValue(primaryColor)}20)`,
												mixBlendMode: theme === 'light' ? 'multiply' : 'screen',
											}}
										/>
									</div>
									<button
										type="button"
										onClick={handleRemoveWallpaper}
										className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center ${
											theme === 'light' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
										} hover:scale-110 transition-all shadow-lg`}
									>
										<X className="w-3 h-3" />
									</button>
								</div>
							) : (
								<label
									className={`w-full h-32 rounded-xl border-2 border-dashed ${borderColor} flex flex-col items-center justify-center cursor-pointer transition-all ${hoverBg}`}
								>
									<ImageIcon className={`w-8 h-8 ${mutedColor} mb-2`} />
									<span className={`text-xs ${textColor} mb-1`}>Click to upload</span>
									<span className={`text-[10px] ${subtleColor}`}>PNG, JPG up to 5MB</span>
									<input
										type="file"
										accept="image/*"
										onChange={handleWallpaperUpload}
										className="hidden"
									/>
								</label>
							)}
						</div>
					</div>
				</section>

				{/* Performance Section */}
				<section className={`${cardBg} rounded-2xl border ${borderColor} overflow-hidden`}>
					<div className="p-4 border-b border-white/10">
						<div className="flex items-center gap-3">
							<div
								className={`w-8 h-8 rounded-xl ${theme === 'light' ? 'bg-gray-100' : 'bg-white/5'} flex items-center justify-center`}
							>
								<Settings2 className={`w-4 h-4 ${mutedColor}`} />
							</div>
							<div>
								<h3 className={`text-sm font-semibold ${textColor}`}>Performance</h3>
								<p className={`text-xs ${subtleColor}`}>Reduce GPU and CPU load on slower devices</p>
							</div>
						</div>
					</div>

					<div className="p-4">
						<div
							className={`flex items-start justify-between gap-4 rounded-xl border ${borderColor} ${theme === 'light' ? 'bg-gray-50' : 'bg-white/5'} p-3`}
						>
							<div className="flex-1">
								<p className={`text-sm font-medium ${textColor}`}>Disable animations</p>
								<p className={`text-xs ${subtleColor} mt-1`}>
									Turn off transitions and animated effects across the app. Useful for slower
									devices like Raspberry Pis.
								</p>
							</div>
							<Switch
								checked={disableAnimations}
								onCheckedChange={(checked) => updateSettings({ disableAnimations: checked })}
								aria-label="Disable animations across the app"
							/>
						</div>
					</div>
				</section>

				{/* Connection Section */}
				<section className={`${cardBg} rounded-2xl border ${borderColor} overflow-hidden`}>
					<div className="p-4 border-b border-white/10">
						<div className="flex items-center gap-3">
							<div
								className={`w-8 h-8 rounded-xl ${theme === 'light' ? 'bg-gray-100' : 'bg-white/5'} flex items-center justify-center`}
							>
								<Server className={`w-4 h-4 ${mutedColor}`} />
							</div>
							<div>
								<h3 className={`text-sm font-semibold ${textColor}`}>Connection</h3>
								<p className={`text-xs ${subtleColor}`}>Smart home instance</p>
							</div>
						</div>
					</div>

					<div className="p-4 space-y-3">
						<div
							className={`p-3 rounded-xl border ${borderColor} ${theme === 'light' ? 'bg-gray-50' : 'bg-white/5'}`}
						>
							<p className={`text-xs ${subtleColor} mb-1.5`}>Connected to</p>
							<p className={`text-sm ${textColor} font-mono break-all`}>
								{config?.url || 'Not connected'}
							</p>
						</div>

						{/* Link to Smart Home */}
						{config?.url && (
							<a
								href={config.url}
								target="_blank"
								rel="noopener noreferrer"
								className={`block p-3 rounded-xl border ${borderColor} ${theme === 'light' ? 'bg-gray-50' : 'bg-white/5'} ${hoverBg} transition-all group`}
							>
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-1">
											<p className={`text-sm font-medium ${textColor}`}>Open Smart Home</p>
											<ExternalLink
												className={`w-3.5 h-3.5 ${mutedColor} group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform`}
											/>
										</div>
										<p className={`text-xs ${subtleColor}`}>
											Configure devices, automations, and advanced settings
										</p>
									</div>
								</div>
							</a>
						)}

						{/* Reset Connection Button */}
						{config?.url && (
							<button
								type="button"
								onClick={handleResetConnection}
								className={`w-full p-3 rounded-xl border ${borderColor} ${theme === 'light' ? 'bg-gray-50' : 'bg-white/5'} ${hoverBg} transition-all text-left flex items-center gap-3`}
							>
								<Settings2 className={`w-4 h-4 ${mutedColor}`} />
								<div className="flex-1">
									<p className={`text-sm font-medium ${textColor}`}>Reset Connection</p>
									<p className={`text-xs ${subtleColor}`}>Change smart home URL or token</p>
								</div>
							</button>
						)}
					</div>
				</section>

				{/* About Section */}
				<section className={`${cardBg} rounded-2xl border ${borderColor} overflow-hidden`}>
					<div className="p-4 border-b border-white/10">
						<div className="flex items-center gap-3">
							<div
								className={`w-8 h-8 rounded-xl ${theme === 'light' ? 'bg-gray-100' : 'bg-white/5'} flex items-center justify-center`}
							>
								<Info className={`w-4 h-4 ${mutedColor}`} />
							</div>
							<div>
								<h3 className={`text-sm font-semibold ${textColor}`}>About</h3>
								<p className={`text-xs ${subtleColor}`}>Dashboard information</p>
							</div>
						</div>
					</div>

					<div className="p-4 space-y-2">
						<div className="flex justify-between items-center">
							<span className={`text-sm ${mutedColor}`}>Version</span>
							<span className={`text-sm font-medium ${textColor}`}>1.0.0</span>
						</div>
						<div className="flex justify-between items-center">
							<span className={`text-sm ${mutedColor}`}>Build</span>
							<span className={`text-sm font-medium ${textColor}`}>March 2026</span>
						</div>
					</div>
				</section>

				{/* License Section */}
				<section className={`${cardBg} rounded-2xl border ${borderColor} overflow-hidden`}>
					<div className="p-4 border-b border-white/10">
						<div className="flex items-center gap-3">
							<div
								className={`w-8 h-8 rounded-xl ${theme === 'light' ? 'bg-gray-100' : 'bg-white/5'} flex items-center justify-center`}
							>
								<Scale className={`w-4 h-4 ${mutedColor}`} />
							</div>
							<div>
								<h3 className={`text-sm font-semibold ${textColor}`}>License</h3>
								<p className={`text-xs ${subtleColor}`}>CC BY-NC-SA 4.0</p>
							</div>
						</div>
					</div>

					<div className="p-4 space-y-3">
						<div
							className={`p-3 rounded-xl border ${borderColor} ${theme === 'light' ? 'bg-gray-50' : 'bg-white/5'}`}
						>
							<p className={`text-xs ${textColor} mb-2`}>
								This work is licensed under the Creative Commons
								Attribution-NonCommercial-ShareAlike 4.0 International License.
							</p>
							<p className={`text-xs ${subtleColor}`}>
								Free for personal, educational, and non-profit use. Commercial use requires a
								separate license.
							</p>
						</div>

						<button
							type="button"
							onClick={() => setShowLicense(!showLicense)}
							className={`w-full p-3 rounded-xl border ${borderColor} ${hoverBg} transition-all text-left flex items-center justify-between`}
						>
							<div className="flex items-center gap-2">
								<FileText className={`w-4 h-4 ${mutedColor}`} />
								<span className={`text-sm ${textColor}`}>View Full License</span>
							</div>
							<ExternalLink className={`w-3.5 h-3.5 ${mutedColor}`} />
						</button>

						{showLicense && (
							<div
								className={`p-4 rounded-xl border ${borderColor} ${theme === 'light' ? 'bg-gray-50' : 'bg-white/5'} max-h-64 overflow-y-auto`}
							>
								<div className={`text-xs ${textColor} space-y-3 leading-relaxed`}>
									<div>
										<p className="font-semibold mb-1">You are free to:</p>
										<ul className="list-disc list-inside space-y-1 ml-2">
											<li>
												<strong>Share</strong> — copy and redistribute the material
											</li>
											<li>
												<strong>Adapt</strong> — remix, transform, and build upon the material
											</li>
										</ul>
									</div>
									<div>
										<p className="font-semibold mb-1">Under the following terms:</p>
										<ul className="list-disc list-inside space-y-1 ml-2">
											<li>
												<strong>Attribution</strong> — You must give appropriate credit
											</li>
											<li>
												<strong>NonCommercial</strong> — You may not use the material for commercial
												purposes
											</li>
											<li>
												<strong>ShareAlike</strong> — If you remix or build upon the material, you
												must distribute your contributions under the same license
											</li>
										</ul>
									</div>
									<div className="pt-2 border-t border-white/10">
										<a
											href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-500 hover:underline"
										>
											Read the full legal code →
										</a>
									</div>
								</div>
							</div>
						)}
					</div>
				</section>

				{/* Terms of Use Section */}
				<section className={`${cardBg} rounded-2xl border ${borderColor} overflow-hidden`}>
					<div className="p-4 border-b border-white/10">
						<div className="flex items-center gap-3">
							<div
								className={`w-8 h-8 rounded-xl ${theme === 'light' ? 'bg-gray-100' : 'bg-white/5'} flex items-center justify-center`}
							>
								<FileText className={`w-4 h-4 ${mutedColor}`} />
							</div>
							<div>
								<h3 className={`text-sm font-semibold ${textColor}`}>Terms of Use</h3>
								<p className={`text-xs ${subtleColor}`}>Usage guidelines</p>
							</div>
						</div>
					</div>

					<div className="p-4 space-y-3">
						<div
							className={`p-3 rounded-xl border ${borderColor} ${theme === 'light' ? 'bg-gray-50' : 'bg-white/5'}`}
						>
							<p className={`text-xs ${textColor} mb-2`}>
								By using this software, you agree to the terms of use.
							</p>
							<p className={`text-xs ${subtleColor}`}>Last updated: March 5, 2026</p>
						</div>

						<button
							type="button"
							onClick={() => setShowTerms(!showTerms)}
							className={`w-full p-3 rounded-xl border ${borderColor} ${hoverBg} transition-all text-left flex items-center justify-between`}
						>
							<div className="flex items-center gap-2">
								<FileText className={`w-4 h-4 ${mutedColor}`} />
								<span className={`text-sm ${textColor}`}>View Terms of Use</span>
							</div>
							<ExternalLink className={`w-3.5 h-3.5 ${mutedColor}`} />
						</button>

						{showTerms && (
							<div
								className={`p-4 rounded-xl border ${borderColor} ${theme === 'light' ? 'bg-gray-50' : 'bg-white/5'} max-h-64 overflow-y-auto`}
							>
								<div className={`text-xs ${textColor} space-y-3 leading-relaxed`}>
									<div>
										<p className="font-semibold mb-1">Permitted Use:</p>
										<ul className="list-disc list-inside space-y-1 ml-2">
											<li>Personal use on your home devices</li>
											<li>Educational and learning purposes</li>
											<li>Non-profit organizations</li>
											<li>Contributing to the open-source project</li>
										</ul>
									</div>
									<div>
										<p className="font-semibold mb-1">Prohibited Use:</p>
										<ul className="list-disc list-inside space-y-1 ml-2">
											<li>Commercial use or revenue generation</li>
											<li>Corporate deployment for business purposes</li>
											<li>Offering as a paid service or SaaS</li>
											<li>White-labeling and reselling</li>
										</ul>
									</div>
									<div>
										<p className="font-semibold mb-1">Disclaimer:</p>
										<p className={`${subtleColor} ml-2`}>
											THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND. The author is
											not responsible for any security breaches or damages resulting from use of
											this software.
										</p>
									</div>
									<div className="pt-2 border-t border-white/10">
										<p className={`${subtleColor}`}>
											For commercial licensing inquiries, please contact the author on GitHub.
										</p>
									</div>
								</div>
							</div>
						)}
					</div>
				</section>

				{/* Credits Section */}
				<section className={`${cardBg} rounded-2xl border ${borderColor} overflow-hidden`}>
					<div className="p-4 border-b border-white/10">
						<div className="flex items-center gap-3">
							<div
								className={`w-8 h-8 rounded-xl ${theme === 'light' ? 'bg-gray-100' : 'bg-white/5'} flex items-center justify-center`}
							>
								<Heart className={`w-4 h-4 ${mutedColor}`} />
							</div>
							<div>
								<h3 className={`text-sm font-semibold ${textColor}`}>Credits</h3>
								<p className={`text-xs ${subtleColor}`}>Made with ❤️ by the community</p>
							</div>
						</div>
					</div>

					<div className="p-4 space-y-3">
						{/* Creator */}
						<a
							href="https://github.com/awesomestvi/"
							target="_blank"
							rel="noopener noreferrer"
							className={`block p-3 rounded-xl border ${borderColor} ${theme === 'light' ? 'bg-gray-50' : 'bg-white/5'} ${hoverBg} transition-all group`}
						>
							<div className="flex items-center gap-3">
								<div
									className={`w-10 h-10 rounded-full ${theme === 'light' ? 'bg-gray-200' : 'bg-white/10'} flex items-center justify-center`}
								>
									<Github className={`w-5 h-5 ${textColor}`} />
								</div>
								<div className="flex-1">
									<div className="flex items-center gap-2">
										<p className={`text-sm font-semibold ${textColor}`}>awesomestvi</p>
										<ExternalLink
											className={`w-3 h-3 ${mutedColor} group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform`}
										/>
									</div>
									<p className={`text-xs ${subtleColor}`}>Creator & Maintainer</p>
								</div>
							</div>
						</a>

						{/* Acknowledgments */}
						<div
							className={`p-3 rounded-xl border ${borderColor} ${theme === 'light' ? 'bg-gray-50' : 'bg-white/5'}`}
						>
							<p className={`text-xs font-semibold ${textColor} mb-2`}>Built with:</p>
							<div className={`text-xs ${subtleColor} space-y-1`}>
								<p>• React & TypeScript</p>
								<p>• Tailwind CSS v4</p>
								<p>• Radix UI</p>
								<p>• Smart Home Community</p>
							</div>
						</div>

						{/* Support */}
						<div
							className={`p-3 rounded-xl border ${borderColor} ${theme === 'light' ? 'bg-gray-50' : 'bg-white/5'}`}
						>
							<p className={`text-xs ${textColor} mb-1`}>
								If you find this project useful, consider giving it a ⭐️ on GitHub!
							</p>
							<p className={`text-xs ${subtleColor}`}>
								Contributions and feedback are always welcome.
							</p>
						</div>
					</div>
				</section>

				{/* Logout Section */}
				<section>
					<button
						type="button"
						onClick={handleLogout}
						className={`w-full p-4 rounded-2xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 transition-all text-left flex items-center gap-3`}
					>
						<div className="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center">
							<LogOut className="w-4 h-4 text-red-500" />
						</div>
						<div>
							<p className="text-sm font-semibold text-red-500">Logout</p>
							<p className={`text-xs ${mutedColor}`}>Disconnect from your system</p>
						</div>
					</button>
				</section>
			</div>
		</div>
	);
}
