import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import type {
  SectionNavItem,
  SettingsSectionStyles,
} from '../hooks/use-settings-section-controller';

interface SettingsSectionShellProps {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  styles: SettingsSectionStyles;
  children: ReactNode;
}

interface SettingsItemProps {
  title: string;
  description: string;
  styles: SettingsSectionStyles;
  children: ReactNode;
}

interface SettingsHeroProps {
  navItems: SectionNavItem[];
  styles: SettingsSectionStyles;
}

export function SettingsSectionShell({
  id,
  icon: Icon,
  title,
  description,
  styles,
  children,
}: SettingsSectionShellProps) {
  return (
    <section id={id} className={`rounded-[32px] border ${styles.borderColor} ${styles.cardBg}`}>
      <div className="px-6 py-6 md:px-8 md:py-8">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${styles.borderColor} ${styles.iconBg}`}
          >
            <Icon className={`h-5 w-5 ${styles.mutedColor}`} />
          </div>
          <div className="min-w-0">
            <h2 className={`text-xl font-semibold tracking-tight ${styles.textColor}`}>{title}</h2>
            <p className={`mt-1 max-w-2xl text-sm leading-relaxed ${styles.subtleColor}`}>
              {description}
            </p>
          </div>
        </div>

        <div className={`mt-8 divide-y ${styles.dividerColor}`}>{children}</div>
      </div>
    </section>
  );
}

export function SettingsItem({ title, description, styles, children }: SettingsItemProps) {
  return (
    <div className="py-6">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:gap-8">
        <div className="min-w-0">
          <h3 className={`text-base font-medium tracking-tight ${styles.textColor}`}>{title}</h3>
          <p className={`mt-2 text-sm leading-relaxed ${styles.subtleColor}`}>{description}</p>
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

export function SettingsHero({ navItems, styles }: SettingsHeroProps) {
  return (
    <section
      className={`relative overflow-hidden rounded-[36px] border px-6 py-8 md:px-8 md:py-10 ${styles.borderColor} ${styles.cardBg}`}
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${styles.accentColor}88, transparent)`,
        }}
      />
      <div
        className="absolute right-[-36px] top-[-28px] h-36 w-36 rounded-full blur-3xl"
        style={{ backgroundColor: `${styles.accentColor}18` }}
      />
      <div
        className="absolute left-[-20px] bottom-[-44px] h-32 w-32 rounded-full blur-3xl"
        style={{ backgroundColor: `${styles.accentColor}10` }}
      />
      <div className={`absolute inset-0 bg-gradient-to-br ${styles.softBg} opacity-35`} />

      <div className="relative">
        <p
          className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${styles.subtleColor}`}
        >
          Settings
        </p>
        <h1
          className={`mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl ${styles.textColor}`}
        >
          A calmer place to tune Navet.
        </h1>
        <p className={`mt-4 max-w-2xl text-sm leading-7 md:text-base ${styles.subtleColor}`}>
          Large type, fewer boxes, and one clear action path per setting. The page stays scalable,
          but it should now read more like a product settings experience than a dense control panel.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {navItems.map(({ id, label, icon: Icon }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-colors ${styles.borderColor} ${styles.chipBg} ${styles.chipHoverBg} ${styles.mutedColor}`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
