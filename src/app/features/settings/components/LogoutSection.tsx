import { LogOut } from 'lucide-react';

interface LogoutSectionProps {
	handleLogout: () => void;
}

export function LogoutSection({ handleLogout }: LogoutSectionProps) {
	return (
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
					<p className={`text-xs text-gray-500`}>Disconnect from your system</p>
				</div>
			</button>
		</section>
	);
}
