import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { memo } from 'react';

interface DialogHeaderProps {
  title: string;
  description: string;
  isOn: boolean;
}

export const DialogHeader = memo(function DialogHeader({
  title,
  description,
  isOn,
}: DialogHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <Dialog.Title
          className={`text-xl font-semibold transition-colors duration-500 ${isOn ? 'text-white' : 'text-gray-400'}`}
        >
          {title}
        </Dialog.Title>
        <Dialog.Description
          className={`text-sm mt-1 transition-colors duration-500 ${isOn ? 'text-gray-400' : 'text-gray-600'}`}
        >
          {description}
        </Dialog.Description>
      </div>

      <Dialog.Close asChild>
        <button
          type="button"
          className={`p-2 rounded-lg transition-all duration-300 ${
            isOn ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 hover:bg-white/10'
          }`}
        >
          <X
            className={`w-5 h-5 transition-colors duration-500 ${isOn ? 'text-gray-400' : 'text-gray-600'}`}
          />
        </button>
      </Dialog.Close>
    </div>
  );
});
