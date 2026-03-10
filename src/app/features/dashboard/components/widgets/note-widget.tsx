import { Check, Edit2, StickyNote } from 'lucide-react';
import { useState } from 'react';
import type { CardSize } from '@/app/components/shared/card-size-selector';
import { getThemeColorValue } from '@/app/components/shared/theme/theme-colors';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useTheme } from '@/app/hooks';

interface NoteWidgetProps {
  size?: CardSize;
  initialNote?: string;
  onNoteChange?: (note: string) => void;
}

export function NoteWidget({ initialNote = '', onNoteChange }: Omit<NoteWidgetProps, 'size'>) {
  const { theme, primaryColor } = useTheme();
  const surface = getThemeSurfaceTokens(theme);
  const [note, setNote] = useState(initialNote || 'Click to add a note...');
  const [isEditing, setIsEditing] = useState(false);
  const [tempNote, setTempNote] = useState(note);

  const bgColor =
    theme === 'light' ? 'bg-white/70' : theme === 'contrast' ? 'bg-black/50' : surface.panel;
  const textPrimary = surface.textPrimary;
  const textSecondary = surface.textSecondary;
  const border = theme === 'light' ? 'border-gray-200/50' : surface.border;
  const subtleFill =
    theme === 'light'
      ? '#f3f4f6'
      : theme === 'contrast'
        ? 'rgba(255,255,255,0.05)'
        : 'rgba(255,255,255,0.08)';

  const handleStartEdit = () => {
    setTempNote(note);
    setIsEditing(true);
  };

  const handleSave = () => {
    setNote(tempNote);
    setIsEditing(false);
    if (onNoteChange) {
      onNoteChange(tempNote);
    }
  };

  const handleCancel = () => {
    setTempNote(note);
    setIsEditing(false);
  };

  return (
    <div
      className={`${bgColor} backdrop-blur-xl rounded-2xl p-4 border ${border} h-full flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: `${getThemeColorValue(primaryColor)}20`,
            color: getThemeColorValue(primaryColor),
          }}
        >
          <StickyNote className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-semibold ${textPrimary}`}>Quick Note</h3>
          <p className={`text-[10px] ${surface.textMuted} truncate mt-0.5`}>Widget</p>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={handleStartEdit}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ backgroundColor: subtleFill }}
          >
            <Edit2 className={`w-4 h-4 ${textSecondary}`} />
          </button>
        )}
      </div>

      {/* Note Content */}
      <div className="flex-1 flex flex-col">
        {isEditing ? (
          <>
            <textarea
              value={tempNote}
              onChange={(e) => setTempNote(e.target.value)}
              className={`flex-1 p-3 rounded-xl text-sm resize-none focus:outline-none ${textPrimary}`}
              style={{
                backgroundColor: subtleFill,
                border: `2px solid ${getThemeColorValue(primaryColor)}`,
              }}
              placeholder="Write your note here..."
            />
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={handleCancel}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${textSecondary}`}
                style={{ backgroundColor: subtleFill }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 py-2 rounded-lg text-xs font-medium text-white transition-colors"
                style={{ backgroundColor: getThemeColorValue(primaryColor) }}
              >
                <div className="flex items-center justify-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Save</span>
                </div>
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={handleStartEdit}
            className={`flex-1 p-3 rounded-xl text-sm cursor-pointer transition-colors text-left ${
              note === 'Click to add a note...' ? textSecondary : textPrimary
            }`}
            style={{ backgroundColor: subtleFill }}
          >
            <p className="whitespace-pre-wrap">{note}</p>
          </button>
        )}
      </div>
    </div>
  );
}
