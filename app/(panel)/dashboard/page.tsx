'use client';

import React from 'react';
import MainContent from '@/components/MainContent';
import { useAdmin } from '@/context/AdminContext';

export default function DashboardPage() {
  const { activeTab, setActiveTab, handleNavigate, addToast } = useAdmin();

  return (
    <MainContent
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onNavigate={handleNavigate}
      onShowToast={addToast}
    />
  );
}
