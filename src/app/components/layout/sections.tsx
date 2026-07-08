import { Clipboard, Lightbulb, Lock, Tv, Video } from 'lucide-react';
import { EmptyState } from '../shared/empty-state';

export function SecuritySection() {
  return (
    <EmptyState
      icon={Video}
      title="No Security Cameras"
      description="You don't have any security cameras configured yet. Add cameras to monitor your home."
    />
  );
}

export function TasksSection() {
  return (
    <EmptyState
      icon={Clipboard}
      title="No Tasks"
      description="You don't have any tasks or automations configured yet. Create tasks to manage your home routines."
    />
  );
}

export function LocksSection() {
  return (
    <EmptyState
      icon={Lock}
      title="No Smart Locks"
      description="You don't have any smart locks configured yet. Add locks to manage access to your home."
    />
  );
}

export function LightsSection() {
  return (
    <EmptyState
      icon={Lightbulb}
      title="No Lights"
      description="You don't have any smart lights configured yet. Add lights to control your home lighting."
    />
  );
}

export function MediaSection() {
  return (
    <EmptyState
      icon={Tv}
      title="No Media Players"
      description="You don't have any media players configured yet. Add devices to control your entertainment."
    />
  );
}
