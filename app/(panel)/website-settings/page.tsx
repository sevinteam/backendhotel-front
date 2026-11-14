'use client';

import React from 'react';
import WebsiteSettings from '@/components/WebsiteSettings';
import { useAdmin } from '@/context/AdminContext';

export default function WebsiteSettingsPage() {
  const { addToast } = useAdmin();

  return <WebsiteSettings onShowToast={addToast} />;
}
