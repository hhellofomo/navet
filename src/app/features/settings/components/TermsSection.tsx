import { ExternalLink, FileText } from 'lucide-react';
import type { ThemeType } from '../../../contexts/theme-context';

interface TermsSectionProps {
	theme: ThemeType;
	showTerms: boolean;
	setShowTerms: (show: boolean) => void;
}

export function TermsSection({ theme, showTerms, setShowTerms }: TermsSectionProps) {
	const cardBg =
		theme === 'light' ? 'bg-white' : theme === 'contrast' ? 'bg-gray-950' : 'bg-gray-900';
	const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
	const mutedColor = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
	const subtleColor = theme === 'light' ? 'text-gray-500' : 'text-gray-500';
	const borderColor = theme === 'light' ? 'border-gray-200' : 'border-white/10';
	const hoverBg = theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-white/5';

	return (
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
									THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND. The author is not
									responsible for any security breaches or damages resulting from use of this
									software.
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
	);
}
