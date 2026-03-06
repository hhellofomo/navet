import { AlertCircle, CheckCircle2, ExternalLink, Loader2, Lock, Server } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useConfig } from '../contexts/config-context';
import { useTheme } from '../contexts/theme-context';

export function SetupWizard() {
	const { saveConfig, testConnection } = useConfig();
	const { theme, primaryColor } = useTheme();
	const [url, setUrl] = useState('');
	const [token, setToken] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	// Theme colors
	const bgColor = theme === 'light' ? 'bg-gray-50' : 'bg-[#0a0a0a]';
	const cardBg =
		theme === 'light' ? 'bg-white' : theme === 'contrast' ? 'bg-gray-950' : 'bg-gray-900';
	const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
	const mutedColor = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
	const borderColor = theme === 'light' ? 'border-gray-200' : 'border-white/10';
	const inputBg = theme === 'light' ? 'bg-gray-50' : 'bg-white/5';
	const inputBorder = theme === 'light' ? 'border-gray-300' : 'border-white/10';
	const inputFocus =
		theme === 'light'
			? 'focus:border-gray-900 focus:ring-gray-900'
			: 'focus:border-white/20 focus:ring-white/20';

	const getColorValue = (color: string): string => {
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
		return colors[color] || colors.orange;
	};

	const handleTestConnection = async () => {
		if (!url || !token) {
			setError('Please enter both URL and token');
			toast.error('Please enter both URL and token');
			return;
		}

		setError(null);
		setIsLoading(true);

		try {
			const isValid = await testConnection(url, token);

			if (isValid) {
				setSuccess(true);
				setError(null);
				toast.success('Connection successful!');
			} else {
				const errorMsg =
					'Connection test failed. This may be due to CORS restrictions. You can still save and try connecting.';
				setError(errorMsg);
				setSuccess(false);
				toast.warning(errorMsg);
			}
		} catch (_err) {
			const errorMsg =
				'Unable to test connection. This is normal in development. You can still save and try connecting.';
			setError(errorMsg);
			setSuccess(false);
			toast.warning(errorMsg);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSave = async () => {
		if (!url || !token) {
			setError('Please enter both URL and token');
			toast.error('Please enter both URL and token');
			return;
		}

		setError(null);
		setIsLoading(true);

		try {
			const saved = await saveConfig({ url, token });

			if (saved) {
				toast.success('Configuration saved! Redirecting to dashboard...');
			} else {
				const errorMsg = 'Failed to save configuration.';
				setError(errorMsg);
				toast.error(errorMsg);
			}
		} catch (_err) {
			const errorMsg = 'An error occurred while saving the configuration.';
			setError(errorMsg);
			toast.error(errorMsg);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={`min-h-screen ${bgColor} flex items-center justify-center p-4`}>
			<div className="w-full max-w-md space-y-6">
				{/* Header */}
				<div className="text-center space-y-2">
					<div
						className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center"
						style={{ backgroundColor: `${getColorValue(primaryColor)}20` }}
					>
						<Server className="w-8 h-8" style={{ color: getColorValue(primaryColor) }} />
					</div>
					<h1 className={`text-2xl font-bold ${textColor}`}>Welcome to Navet</h1>
					<p className={`text-sm ${mutedColor}`}>
						Connect to your smart home system to get started
					</p>
				</div>

				{/* Setup Card */}
				<div className={`${cardBg} rounded-2xl border ${borderColor} overflow-hidden`}>
					<div className="p-6 space-y-4">
						{/* URL Input */}
						<div>
							<label className={`text-sm font-medium ${textColor} block mb-2`}>
								Smart Home URL
							</label>
							<input
								type="url"
								value={url}
								onChange={(e) => {
									setUrl(e.target.value);
									setSuccess(false);
									setError(null);
								}}
								placeholder="http://homeassistant.local:8123"
								className={`w-full px-4 py-3 rounded-xl border ${inputBorder} ${inputBg} ${textColor} text-sm ${inputFocus} focus:outline-none focus:ring-1 transition-colors`}
							/>
							<p className={`text-xs ${mutedColor} mt-1.5`}>
								The full URL to your smart home instance
							</p>
						</div>

						{/* Token Input */}
						<div>
							<label className={`text-sm font-medium ${textColor} block mb-2`}>
								Long-Lived Access Token
							</label>
							<input
								type="password"
								value={token}
								onChange={(e) => {
									setToken(e.target.value);
									setSuccess(false);
									setError(null);
								}}
								placeholder="Enter your access token"
								className={`w-full px-4 py-3 rounded-xl border ${inputBorder} ${inputBg} ${textColor} text-sm ${inputFocus} focus:outline-none focus:ring-1 transition-colors`}
							/>
							<p className={`text-xs ${mutedColor} mt-1.5`}>
								Generate one in your smart home system under Profile → Security
							</p>
						</div>

						{/* Help Link */}
						<a
							href="https://www.home-assistant.io/docs/authentication/"
							target="_blank"
							rel="noopener noreferrer"
							className={`flex items-center gap-2 text-xs ${mutedColor} hover:${textColor} transition-colors`}
						>
							<Lock className="w-3 h-3" />
							<span>How to create an access token</span>
							<ExternalLink className="w-3 h-3" />
						</a>

						{/* Error Message */}
						{error && (
							<div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
								<AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
								<p className="text-sm text-red-500">{error}</p>
							</div>
						)}

						{/* Success Message */}
						{success && (
							<div className="flex items-start gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
								<CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
								<p className="text-sm text-green-500">
									Connection successful! Click "Connect" to continue.
								</p>
							</div>
						)}

						{/* Action Buttons */}
						<div className="space-y-3 pt-2">
							<div className="flex gap-3">
								<button
									onClick={handleTestConnection}
									disabled={isLoading || !url || !token}
									className={`flex-1 px-4 py-3 rounded-xl border ${borderColor} ${textColor} text-sm font-medium transition-all ${
										isLoading || !url || !token
											? 'opacity-50 cursor-not-allowed'
											: `hover:bg-white/5`
									} flex items-center justify-center gap-2`}
								>
									{isLoading ? (
										<>
											<Loader2 className="w-4 h-4 animate-spin" />
											Testing...
										</>
									) : (
										'Test Connection'
									)}
								</button>

								<button
									onClick={handleSave}
									disabled={isLoading || !url || !token}
									className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 text-white`}
									style={{
										backgroundColor:
											isLoading || !url || !token ? '#6b7280' : getColorValue(primaryColor),
										opacity: isLoading || !url || !token ? 0.5 : 1,
										cursor: isLoading || !url || !token ? 'not-allowed' : 'pointer',
									}}
								>
									{isLoading ? (
										<>
											<Loader2 className="w-4 h-4 animate-spin" />
											Saving...
										</>
									) : (
										'Save & Continue'
									)}
								</button>
							</div>

							<p className={`text-xs ${mutedColor} text-center`}>
								Test may fail in development due to CORS. You can skip and save directly.
							</p>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="text-center space-y-2">
					<button
						onClick={() => {
							setUrl('http://homeassistant.local:8123');
							setToken('demo-token-for-development');
							toast.info('Demo credentials entered. Click "Save & Continue" to proceed.');
						}}
						className={`text-xs ${mutedColor} hover:${textColor} transition-colors underline`}
					>
						Use demo credentials for development
					</button>
					<p className={`text-xs ${mutedColor}`}>
						Your credentials are stored locally and never shared
					</p>
				</div>
			</div>
		</div>
	);
}
