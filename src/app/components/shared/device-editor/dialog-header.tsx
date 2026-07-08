import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { memo, type ReactNode } from 'react';
import { getDeviceEditorSurfaceTokens } from './device-editor-surface-tokens';

interface DialogHeaderProps {
  title: string;
  description: string;
  isOn: boolean;
  trailing?: ReactNode;
}

export const DialogHeader = memo(function DialogHeader({
  title,
  description,
  isOn,
  trailing,
}: DialogHeaderProps) {
  const editorSurface = getDeviceEditorSurfaceTokens(isOn);

  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <Dialog.Title
          className={`text-xl font-semibold transition-colors duration-500 ${editorSurface.titleClassName}`}
        >
          {title}
        </Dialog.Title>
        <Dialog.Description
          className={`mt-1 text-sm transition-colors duration-500 ${editorSurface.descriptionClassName}`}
        >
          {description}
        </Dialog.Description>
      </div>

      <div className="ml-4 flex items-start gap-2">
        {trailing}

        <Dialog.Close asChild>
          <button
            type="button"
            className={`rounded-lg p-2 transition-all duration-300 ${editorSurface.closeButtonClassName}`}
          >
            <X
              className={`h-5 w-5 transition-colors duration-500 ${editorSurface.closeIconClassName}`}
            />
          </button>
        </Dialog.Close>
      </div>
    </div>
  );
});
