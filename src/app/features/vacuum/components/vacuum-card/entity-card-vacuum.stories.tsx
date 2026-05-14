import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import { VacuumCard } from '@/app/features/vacuum';
import { getStoryDocsDescription } from '@/app/storybook/story-docs';
import { EntityCardStoryFrame, noopCardSizeChange } from '@/app/storybook/story-frames';

function VacuumCardStory(args: Omit<ComponentProps<typeof VacuumCard>, 'onSizeChange'>) {
  return (
    <EntityCardStoryFrame size={args.size ?? 'medium'}>
      <VacuumCard {...args} onSizeChange={noopCardSizeChange} />
    </EntityCardStoryFrame>
  );
}

const meta = {
  title: 'Cards/Entity/Vacuum',
  component: VacuumCardStory,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['small', 'medium', 'large'],
    },
  },
  args: {
    id: 'vacuum.robby',
    name: 'Robby',
    room: 'Ground Floor',
    status: 'cleaning',
    battery: 74,
    cleaningProgress: 42,
    cleanedArea: '42 m²',
    cleaningTime: '38 min',
    nextCleaning: 'Tomorrow 09:00',
    waterLevel: 68,
    binLevel: 34,
    size: 'medium',
    isEditMode: false,
  },
  parameters: { docs: { description: {} } },
} satisfies Meta<typeof VacuumCardStory>;

const richComponentDocsDescription = getStoryDocsDescription(meta.title);

meta.parameters = {
  ...meta.parameters,
  docs: {
    ...meta.parameters?.docs,
    description: {
      ...meta.parameters?.docs?.description,
      component: richComponentDocsDescription,
    },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Small: Story = {
  args: {
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
  },
};

export const Charging: Story = {
  args: {
    status: 'docked',
    battery: 82,
    nextCleaning: 'Fri 10:30',
    waterLevel: 72,
    binLevel: 28,
    size: 'medium',
  },
};

export const FullyCharged: Story = {
  args: {
    status: 'docked',
    battery: 100,
    nextCleaning: 'Sat 08:00',
    waterLevel: 100,
    binLevel: 12,
    size: 'medium',
  },
};

export const LowBattery: Story = {
  args: {
    status: 'idle',
    battery: 18,
    cleaningProgress: 0,
    nextCleaning: 'Tonight 21:00',
    waterLevel: 46,
    binLevel: 41,
    size: 'medium',
  },
};

export const MissingLevels: Story = {
  args: {
    status: 'docked',
    battery: 63,
    cleaningProgress: 0,
    nextCleaning: undefined,
    waterLevel: undefined,
    binLevel: undefined,
    size: 'medium',
  },
};

export const NeedsAttention: Story = {
  args: {
    status: 'paused',
    battery: 56,
    cleaningProgress: 64,
    cleanedArea: '51 m²',
    cleaningTime: '46 min',
    nextCleaning: 'Today 18:00',
    waterLevel: 9,
    binLevel: 92,
    size: 'large',
  },
};

export const Docs: Story = {
  parameters: {
    docsOnly: true,
  },
};
