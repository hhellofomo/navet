import { Maximize2 } from 'lucide-react';
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { CardEditActionButton } from '@/app/components/shared/card-edit-action-button';
import type { CardSize } from '@/app/components/shared/card-size-selector';
import { getThemeColorValue } from '@/app/components/shared/theme/theme-colors';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useI18n, useTheme } from '@/app/hooks';

type ResizeMenuState = {
  cardId: string;
  currentSize: CardSize;
  allowedSizes: CardSize[];
  top: number;
  left: number;
};

interface DashboardEditActionsProps {
  children: ReactNode;
  isEditMode: boolean;
  onDeleteCard?: (cardId: string) => void;
  onRemoveEntity?: (entityId: string) => void;
  onSizeChange: (id: string, size: CardSize) => void;
}

const DEFAULT_SIZE_OPTIONS: Array<{
  value: CardSize;
  label: string;
  dimensions: string;
}> = [
  { value: 'extra-small', label: 'Extra-Small', dimensions: '1 x 0.5' },
  { value: 'small', label: 'Small', dimensions: '1 x 1' },
  { value: 'medium', label: 'Medium', dimensions: '2 x 1' },
  { value: 'large', label: 'Large', dimensions: '2 x 2' },
];

export function DashboardEditActions({
  children,
  isEditMode,
  onDeleteCard,
  onRemoveEntity,
  onSizeChange,
}: DashboardEditActionsProps) {
  const { theme, primaryColor } = useTheme();
  const { t } = useI18n();
  const surface = getThemeSurfaceTokens(theme);
  const accentColor = getThemeColorValue(primaryColor);
  const [resizeMenu, setResizeMenu] = useState<ResizeMenuState | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!resizeMenu) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (menuRef.current?.contains(event.target as Node)) {
        return;
      }

      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest('[data-dashboard-edit-action="resize"]')) {
        return;
      }

      setResizeMenu(null);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [resizeMenu]);

  const sizeOptions = useMemo(
    () =>
      DEFAULT_SIZE_OPTIONS.filter((option) =>
        resizeMenu ? resizeMenu.allowedSizes.includes(option.value) : true
      ),
    [resizeMenu]
  );

  if (!isEditMode) {
    return <>{children}</>;
  }

  return (
    <>
      <div
        onPointerDownCapture={(event) => {
          const actionTarget =
            event.target instanceof Element
              ? event.target.closest<HTMLElement>('[data-dashboard-edit-action]')
              : null;

          if (!actionTarget) {
            return;
          }

          event.preventDefault();
          event.stopPropagation();
        }}
        onClickCapture={(event) => {
          const actionTarget =
            event.target instanceof Element
              ? event.target.closest<HTMLElement>('[data-dashboard-edit-action]')
              : null;

          if (!actionTarget) {
            return;
          }

          event.preventDefault();
          event.stopPropagation();

          const action = actionTarget.dataset.dashboardEditAction;
          const cardId = actionTarget.dataset.cardId;
          if (!action || !cardId) {
            return;
          }

          if (action === 'remove-entity' && onRemoveEntity) {
            onRemoveEntity(cardId);
            return;
          }

          if (action === 'delete-card' && onDeleteCard) {
            if (window.confirm(t('widgets.deleteConfirm'))) {
              onDeleteCard(cardId);
            }
            return;
          }

          if (action === 'resize') {
            const currentSize = (actionTarget.dataset.cardSize as CardSize | undefined) ?? 'small';
            const allowedSizes = (actionTarget.dataset.allowedSizes?.split(',').filter(Boolean) as
              | CardSize[]
              | undefined) ?? ['small', 'medium', 'large'];
            const rect = actionTarget.getBoundingClientRect();

            setResizeMenu({
              cardId,
              currentSize,
              allowedSizes,
              top: rect.bottom + 8,
              left: rect.right - 260,
            });
          }
        }}
      >
        {children}
      </div>

      {resizeMenu ? (
        <div
          ref={menuRef}
          className={`fixed z-[70] min-w-[260px] rounded-2xl border p-3 shadow-2xl backdrop-blur-xl ${surface.panel} ${surface.border}`}
          style={{
            top: `${Math.max(16, resizeMenu.top)}px`,
            left: `${Math.max(16, resizeMenu.left)}px`,
          }}
        >
          <div className="space-y-1.5">
            <h3
              className={`mb-2 px-1 text-xs font-semibold uppercase tracking-wider ${surface.textSecondary}`}
            >
              Widget Size
            </h3>
            {sizeOptions.map((size) => (
              <button
                type="button"
                key={size.value}
                onClick={() => {
                  onSizeChange(resizeMenu.cardId, size.value);
                  setResizeMenu(null);
                }}
                className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all duration-200 ${
                  resizeMenu.currentSize === size.value
                    ? ''
                    : `${surface.subtleBg} ${surface.hoverBg} ${surface.border}`
                }`}
                style={
                  resizeMenu.currentSize === size.value
                    ? {
                        backgroundColor:
                          theme === 'light' ? `${accentColor}12` : `${accentColor}18`,
                        borderColor: `${accentColor}55`,
                      }
                    : undefined
                }
              >
                <div>
                  <div className={surface.textPrimary}>{size.label}</div>
                  <div className={`text-xs ${surface.textSecondary}`}>{size.dimensions}</div>
                </div>
                {resizeMenu.currentSize === size.value ? (
                  <div
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                ) : null}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

interface DashboardResizeTriggerProps {
  cardId: string;
  cardSize: CardSize;
  allowedSizes: CardSize[];
}

export function DashboardResizeTrigger({
  cardId,
  cardSize,
  allowedSizes,
}: DashboardResizeTriggerProps) {
  if (allowedSizes.length <= 1) {
    return null;
  }

  return (
    <CardEditActionButton
      cardSize={cardSize}
      Icon={Maximize2}
      placement="top-right"
      className="z-50 group cursor-pointer"
      data-dashboard-edit-action="resize"
      data-card-id={cardId}
      data-card-size={cardSize}
      data-allowed-sizes={allowedSizes.join(',')}
      aria-label="Resize card"
    />
  );
}
