import { createContext, type ReactNode, useCallback, useContext, useState } from 'react';

interface ErrorInfo {
	message: string;
	details?: string;
	timestamp: number;
}

interface ErrorContextType {
	error: ErrorInfo | null;
	setError: (message: string, details?: string) => void;
	clearError: () => void;
	hasError: boolean;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: ReactNode }) {
	const [error, setErrorState] = useState<ErrorInfo | null>(null);

	const setError = useCallback((message: string, details?: string) => {
		setErrorState({
			message,
			details,
			timestamp: Date.now(),
		});
	}, []);

	const clearError = useCallback(() => {
		setErrorState(null);
	}, []);

	return (
		<ErrorContext.Provider
			value={{
				error,
				setError,
				clearError,
				hasError: error !== null,
			}}
		>
			{children}
		</ErrorContext.Provider>
	);
}

export function useError() {
	const context = useContext(ErrorContext);
	if (!context) {
		throw new Error('useError must be used within ErrorProvider');
	}
	return context;
}
