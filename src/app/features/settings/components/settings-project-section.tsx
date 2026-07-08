import { ExternalLink, FileText, Github, Info, LogOut, Scale } from 'lucide-react';
import type { SettingsSectionController } from '../hooks/use-settings-section-controller';
import { SettingsItem, SettingsSectionShell } from './settings-section-shell';

interface SettingsProjectSectionProps {
  controller: SettingsSectionController;
}

export function SettingsProjectSection({ controller }: SettingsProjectSectionProps) {
  const { handleLogout, setShowLicense, setShowTerms, showLicense, showTerms, styles } = controller;

  return (
    <SettingsSectionShell
      id="project"
      icon={Info}
      title="Project"
      description="Version details, maintainer links, and the legal basics for using Navet."
      styles={styles}
    >
      <SettingsItem title="About" description="Quick project information." styles={styles}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className={`rounded-[24px] border px-5 py-4 ${styles.borderColor} ${styles.softBg}`}>
            <p className={`text-[11px] uppercase tracking-[0.18em] ${styles.subtleColor}`}>
              Version
            </p>
            <p className={`mt-2 text-lg font-semibold ${styles.textColor}`}>1.0.0</p>
          </div>
          <div className={`rounded-[24px] border px-5 py-4 ${styles.borderColor} ${styles.softBg}`}>
            <p className={`text-[11px] uppercase tracking-[0.18em] ${styles.subtleColor}`}>Build</p>
            <p className={`mt-2 text-lg font-semibold ${styles.textColor}`}>March 2026</p>
          </div>
        </div>
      </SettingsItem>

      <SettingsItem
        title="Credits"
        description="Project maintainer and the stack behind the app."
        styles={styles}
      >
        <a
          href="https://github.com/awesomestvi/"
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-3 rounded-full border px-4 py-3 text-sm font-medium transition-colors ${styles.borderColor} ${styles.softBg} ${styles.hoverBg} ${styles.textColor}`}
        >
          <Github className="h-4 w-4" />
          <span>awesomestvi</span>
          <ExternalLink className={`h-3.5 w-3.5 ${styles.subtleColor}`} />
        </a>

        <div className={`mt-4 space-y-1 text-sm leading-relaxed ${styles.subtleColor}`}>
          <p>React & TypeScript</p>
          <p>Tailwind CSS v4</p>
          <p>Radix UI</p>
          <p>Home Assistant community feedback</p>
        </div>
      </SettingsItem>

      <SettingsItem
        title="License"
        description="CC BY-NC-SA 4.0. Free for personal, educational, and non-profit use."
        styles={styles}
      >
        <button
          type="button"
          onClick={() => setShowLicense(!showLicense)}
          className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition-colors ${styles.borderColor} ${styles.softBg} ${styles.hoverBg} ${styles.textColor}`}
        >
          <Scale className="h-4 w-4" />
          <span>{showLicense ? 'Hide full license' : 'View full license'}</span>
        </button>

        {showLicense ? (
          <div className={`mt-4 rounded-[24px] border p-5 ${styles.borderColor} ${styles.softBg}`}>
            <div className={`space-y-3 text-sm leading-relaxed ${styles.textColor}`}>
              <div>
                <p className="font-semibold">You are free to:</p>
                <ul className="mt-2 ml-4 list-disc space-y-1">
                  <li>Share and redistribute the material.</li>
                  <li>Adapt, remix, transform, and build upon it.</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold">Under these terms:</p>
                <ul className="mt-2 ml-4 list-disc space-y-1">
                  <li>Attribution is required.</li>
                  <li>Commercial use is not allowed.</li>
                  <li>Derivative work must keep the same license.</li>
                </ul>
              </div>
              <a
                href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-500 hover:underline"
              >
                <span>Read the full legal code</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        ) : null}
      </SettingsItem>

      <SettingsItem
        title="Terms of use"
        description="Permitted and prohibited use, plus the standard warranty disclaimer."
        styles={styles}
      >
        <button
          type="button"
          onClick={() => setShowTerms(!showTerms)}
          className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition-colors ${styles.borderColor} ${styles.softBg} ${styles.hoverBg} ${styles.textColor}`}
        >
          <FileText className="h-4 w-4" />
          <span>{showTerms ? 'Hide terms of use' : 'View terms of use'}</span>
        </button>

        {showTerms ? (
          <div className={`mt-4 rounded-[24px] border p-5 ${styles.borderColor} ${styles.softBg}`}>
            <div className={`space-y-3 text-sm leading-relaxed ${styles.textColor}`}>
              <div>
                <p className="font-semibold">Permitted use</p>
                <ul className="mt-2 ml-4 list-disc space-y-1">
                  <li>Personal use on your home devices.</li>
                  <li>Educational and learning purposes.</li>
                  <li>Non-profit organizations.</li>
                  <li>Open-source contributions to the project.</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold">Prohibited use</p>
                <ul className="mt-2 ml-4 list-disc space-y-1">
                  <li>Commercial use or revenue generation.</li>
                  <li>Corporate deployment for business purposes.</li>
                  <li>Offering the software as a paid service.</li>
                  <li>White-labeling or reselling it.</li>
                </ul>
              </div>
              <p className={styles.subtleColor}>
                THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND. The author is not
                responsible for security breaches or damages resulting from use of this software.
              </p>
            </div>
          </div>
        ) : null}
      </SettingsItem>

      <div className="pt-6">
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-5 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/15"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </SettingsSectionShell>
  );
}
