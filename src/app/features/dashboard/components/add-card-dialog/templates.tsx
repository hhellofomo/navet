import type { SVGProps } from 'react';
import type { CardTemplate } from './types';

function Newspaper(props: SVGProps<SVGSVGElement>) {
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

function Image(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <title>Photo</title>
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}

function StickyNote(props: SVGProps<SVGSVGElement>) {
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

export const cardTemplates: CardTemplate[] = [
  {
    id: 'rss',
    nameKey: 'dashboard.addCard.templates.rss.name',
    descriptionKey: 'dashboard.addCard.templates.rss.description',
    icon: <Newspaper className="w-5 h-5" />,
    defaultSize: 'large',
  },
  {
    id: 'photo',
    nameKey: 'dashboard.addCard.templates.photo.name',
    descriptionKey: 'dashboard.addCard.templates.photo.description',
    icon: <Image className="w-5 h-5" />,
    defaultSize: 'large',
  },
  {
    id: 'note',
    nameKey: 'dashboard.addCard.templates.note.name',
    descriptionKey: 'dashboard.addCard.templates.note.description',
    icon: <StickyNote className="w-5 h-5" />,
    defaultSize: 'small',
  },
];
