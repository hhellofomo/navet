import { useState } from 'react';

export interface DashboardDialogs {
  showAddCardDialog: boolean;
  showAddEntityDialog: boolean;
  onOpenAddCardDialog: () => void;
  onCloseAddCardDialog: () => void;
  onOpenAddEntityDialog: () => void;
  onCloseAddEntityDialog: () => void;
}

export function useDashboardDialogs(): DashboardDialogs {
  const [showAddCardDialog, setShowAddCardDialog] = useState(false);
  const [showAddEntityDialog, setShowAddEntityDialog] = useState(false);

  return {
    showAddCardDialog,
    showAddEntityDialog,
    onOpenAddCardDialog: () => setShowAddCardDialog(true),
    onCloseAddCardDialog: () => setShowAddCardDialog(false),
    onOpenAddEntityDialog: () => setShowAddEntityDialog(true),
    onCloseAddEntityDialog: () => setShowAddEntityDialog(false),
  };
}
