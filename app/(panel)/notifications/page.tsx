'use client';

import React from 'react';
import NotificationManagement from '@/components/NotificationManagement';
import { useAdmin } from '@/context/AdminContext';

export default function NotificationsPage() {
  const { addToast } = useAdmin();

  return <NotificationManagement onShowToast={addToast} />;
}
