import { useState } from 'react';
import { toast } from 'sonner';
import { useConfig } from '../../../contexts/config-context';
import { useTheme } from '../../../contexts/theme-context';
import { SetupWizardView } from './SetupWizardView';

export function SetupWizardContainer() {
	const { saveConfig, testConnection } = useConfig();
	const { theme, primaryColor } = useTheme();
	const [url, setUrl] = useState('');
	const [token, setToken] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

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

	const handleUseDemoCredentials = () => {
		setUrl('http://homeassistant.local:8123');
		setToken('demo-token-for-development');
		toast.info('Demo credentials entered. Click "Save & Continue" to proceed.');
	};

	return (
		<SetupWizardView
			url={url}
			token={token}
			isLoading={isLoading}
			error={error}
			success={success}
			theme={theme}
			primaryColor={primaryColor}
			getColorValue={getColorValue}
			setUrl={setUrl}
			setToken={setToken}
			handleTestConnection={handleTestConnection}
			handleSave={handleSave}
			handleUseDemoCredentials={handleUseDemoCredentials}
		/>
	);
}
