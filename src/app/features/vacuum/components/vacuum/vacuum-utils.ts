export type VacuumStatus = 'cleaning' | 'returning' | 'docked' | 'paused' | 'idle';
export type VacuumThemeStatus = Exclude<VacuumStatus, 'idle'>;

export function getVacuumThemeStatus(status: VacuumStatus): VacuumThemeStatus {
  return status === 'idle' ? 'docked' : status;
}

export function getVacuumStatusText(status: VacuumStatus): string {
  switch (status) {
    case 'cleaning':
      return 'Cleaning';
    case 'returning':
      return 'Returning to dock';
    case 'docked':
      return 'Docked';
    case 'paused':
      return 'Paused';
    default:
      return 'Idle';
  }
}

export function getVacuumStatusColorClass(status: VacuumStatus): string {
  switch (status) {
    case 'cleaning':
      return 'text-blue-500';
    case 'returning':
      return 'text-amber-500';
    case 'docked':
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
}

export function getVacuumBatteryGradientClass(battery: number): string {
  if (battery > 60) return 'from-green-500 to-green-600';
  if (battery > 30) return 'from-amber-500 to-amber-600';
  return 'from-red-500 to-red-600';
}
