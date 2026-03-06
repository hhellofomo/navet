import { useState } from 'react';
import { useTheme } from '../../../contexts/theme-context';
import { AddCardDialogView } from './AddCardDialogView';

interface AddCardDialogContainerProps {
  open: boolean;
  onClose: () => void;
  onAddCard: (type: CardType, size: 'small' | 'medium' | 'large') => void;
  currentRoom: string;
}

export type CardType = 'calendar' | 'news' | 'weather' | 'photo' | 'note';

interface CardTemplate {
  id: CardType;
  name: string;
  description: string;
  icon: React.ReactNode;
  defaultSize: 'small' | 'medium' | 'large';
}

const cardTemplates: CardTemplate[] = [
  {
    id: 'calendar',
    name: 'Calendar',
    description: 'View upcoming events and appointments',
    icon: <Calendar className="w-5 h-5" />,
    defaultSize: 'medium',
  },
  {
    id: 'news',
    name: 'News Feed',
    description: 'Latest news and updates',
    icon: <Newspaper className="w-5 h-5" />,
    defaultSize: 'large',
  },
  {
    id: 'weather',
    name: 'Weather',
    description: 'Current weather and forecast',
    icon: <Cloud className="w-5 h-5" />,
    defaultSize: 'medium',
  },
  {
    id: 'photo',
    name: 'Photo Frame',
    description: 'Display your favorite photos',
    icon: <Image className="w-5 h-5" />,
    defaultSize: 'large',
  },
  {
    id: 'note',
    name: 'Quick Note',
    description: 'Sticky note for reminders',
    icon: <StickyNote className="w-5 h-5" />,
    defaultSize: 'small',
  },
];

function Calendar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <title>Calendar</title>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function Newspaper(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <title>News</title>
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8" />
      <path d="M15 18h-5" />
      <path d="M10 6h8v4h-8V6Z" />
    </svg>
  );
}

function Cloud(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <title>Weather</title>
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  );
}

function Image(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <title>Photo</title>
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}

function StickyNote(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <title>Note</title>
      <path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z" />
      <path d="M15 3v6h6" />
      <path d="M10 16s.8 1 2 1c1.3 0 2-1 2-1" />
      <path d="M8 13h0" />
      <path d="M16 13h0" />
    </svg>
  );
}

export function AddCardDialogContainer({
  open,
  onClose,
  onAddCard,
  currentRoom,
}: AddCardDialogContainerProps) {
  const { theme, primaryColor } = useTheme();
  const [selectedType, setSelectedType] = useState<CardType | null>(null);
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>('medium');

  const getColorValue = (color: string) => {
    const colors: Record<string, string> = {
      blue: '#007AFF',
      purple: '#AF52DE',
      pink: '#FF2D55',
      red: '#FF3B30',
      orange: '#FF9500',
      yellow: '#FFCC00',
      green: '#34C759',
      teal: '#5AC8FA',
    };
    return colors[color] || colors.blue;
  };

  const handleAdd = () => {
    if (selectedType) {
      onAddCard(selectedType, selectedSize);
      onClose();
      setSelectedType(null);
      setSelectedSize('medium');
    }
  };

  const selectedTemplate = cardTemplates.find((t) => t.id === selectedType);

  return (
    <AddCardDialogView
      open={open}
      onClose={onClose}
      currentRoom={currentRoom}
      theme={theme}
      primaryColor={primaryColor}
      cardTemplates={cardTemplates}
      selectedType={selectedType}
      setSelectedType={setSelectedType}
      selectedSize={selectedSize}
      setSelectedSize={setSelectedSize}
      selectedTemplate={selectedTemplate}
      getColorValue={getColorValue}
      handleAdd={handleAdd}
    />
  );
}
