'use client';

import React from 'react';
import AdminTaskList from '@/components/AdminTaskList';
import { useAdmin } from '@/context/AdminContext';

export default function TasksPage() {
  const { handleTaskStatusChange, addToast } = useAdmin();

  return (
    <AdminTaskList
      onTaskStatusChange={handleTaskStatusChange}
      onShowToast={addToast}
    />
  );
}
