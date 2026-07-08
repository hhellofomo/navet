import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useI18n } from '@/app/hooks';
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
    <section
      id={id}
      className={`rounded-[28px] border ${styles.borderColor} ${styles.cardBg} md:rounded-[32px]`}
    >
      <div className="px-4 py-5 md:px-8 md:py-8">
        <div className="flex items-start gap-3 md:gap-4">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${styles.borderColor} ${styles.iconBg} md:h-11 md:w-11`}
          >
            <Icon className={`h-4.5 w-4.5 ${styles.mutedColor} md:h-5 md:w-5`} />
          </div>
          <div className="min-w-0">
            <h2 className={`text-lg font-semibold tracking-tight md:text-xl ${styles.textColor}`}>
              {title}
            </h2>
            <p
              className={`mt-1 max-w-2xl text-sm leading-6 md:leading-relaxed ${styles.subtleColor}`}
            >
              {description}
            </p>
          </div>
        </div>

        <div className={`mt-5 divide-y md:mt-8 ${styles.dividerColor}`}>{children}</div>
      </div>
    </section>
  );
}

export function SettingsItem({ title, description, styles, children }: SettingsItemProps) {
  return (
    <div className="py-4 md:py-6">
      <div className="grid gap-4 md:gap-5 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:gap-8">
        <div className="min-w-0">
          <h3 className={`text-base font-medium tracking-tight ${styles.textColor}`}>{title}</h3>
          <p
            className={`mt-1.5 text-sm leading-6 md:mt-2 md:leading-relaxed ${styles.subtleColor}`}
          >
            {description}
          </p>
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

export function SettingsHero({ navItems, styles }: SettingsHeroProps) {
  const { t } = useI18n();

  return (
    <section
      className={`relative overflow-hidden rounded-[30px] border px-5 py-6 md:rounded-[36px] md:px-8 md:py-10 ${styles.borderColor} ${styles.cardBg}`}
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${styles.accentColor}88, transparent)`,
        }}
      />
      <div
        className="absolute right-[-36px] top-[-28px] h-28 w-28 rounded-full blur-3xl md:h-36 md:w-36"
        style={{ backgroundColor: `${styles.accentColor}18` }}
      />
      <div
        className="absolute left-[-20px] bottom-[-44px] h-24 w-24 rounded-full blur-3xl md:h-32 md:w-32"
        style={{ backgroundColor: `${styles.accentColor}10` }}
      />
      <div className={`absolute inset-0 bg-gradient-to-br ${styles.softBg} opacity-35`} />

      <div className="relative">
        <p
          className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${styles.subtleColor}`}
        >
          {t('settings.hero.eyebrow')}
        </p>
        <h1
          className={`mt-3 max-w-3xl text-2xl font-semibold tracking-tight sm:text-3xl md:mt-4 md:text-5xl ${styles.textColor}`}
        >
          {t('settings.hero.title')}
        </h1>
        <p
          className={`mt-3 max-w-2xl text-sm leading-6 md:mt-4 md:text-base md:leading-7 ${styles.subtleColor}`}
        >
          {t('settings.hero.description')}
        </p>

        <div className="-mx-1 mt-5 flex gap-2 overflow-x-auto px-1 pb-1 md:mx-0 md:mt-8 md:flex-wrap md:overflow-visible md:px-0 md:pb-0">
          {navItems.map(({ id, label, icon: Icon }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors md:px-4 ${styles.borderColor} ${styles.chipBg} ${styles.chipHoverBg} ${styles.mutedColor}`}
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
