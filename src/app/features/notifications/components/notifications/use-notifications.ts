import { useState } from 'react';

export interface Notification {
	id: string;
	type: 'info' | 'success' | 'warning' | 'error';
	title: string;
	message: string;
	timestamp: Date;
	read: boolean;
}

interface UseNotificationsReturn {
	notifications: Notification[];
	unreadCount: number;
	markAsRead: (id: string) => void;
	markAllAsRead: () => void;
	deleteNotification: (id: string) => void;
	clearAll: () => void;
}

export function useNotifications(): UseNotificationsReturn {
	// Mock notifications
	const [notifications, setNotifications] = useState<Notification[]>([
		{
			id: '1',
			type: 'warning',
			title: 'Front Door Left Open',
			message: 'The front door has been open for more than 5 minutes',
			timestamp: new Date(Date.now() - 5 * 60 * 1000),
			read: false,
		},
		{
			id: '2',
			type: 'success',
			title: 'Automation Triggered',
			message: 'Good Night routine completed successfully',
			timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
			read: false,
		},
		{
			id: '3',
			type: 'info',
			title: 'Device Updated',
			message: 'Living Room Thermostat firmware updated to v2.1.4',
			timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
			read: true,
		},
		{
			id: '4',
			type: 'error',
			title: 'Connection Issue',
			message: 'Bedroom Motion Sensor is offline',
			timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
			read: true,
		},
	]);

	const unreadCount = notifications.filter((n) => !n.read).length;

	const markAsRead = (id: string) => {
		setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
	};

	const markAllAsRead = () => {
		setNotifications(notifications.map((n) => ({ ...n, read: true })));
	};

	const deleteNotification = (id: string) => {
		setNotifications(notifications.filter((n) => n.id !== id));
	};

	const clearAll = () => {
		if (confirm('Are you sure you want to clear all notifications?')) {
			setNotifications([]);
		}
	};

	return {
		notifications,
		unreadCount,
		markAsRead,
		markAllAsRead,
		deleteNotification,
		clearAll,
	};
}
