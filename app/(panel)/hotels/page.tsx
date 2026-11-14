'use client';

import React from 'react';
import HotelManagement from '@/components/HotelManagement';
import { useAdmin } from '@/context/AdminContext';

export default function HotelsPage() {
  const { addToast, theme } = useAdmin();

  return <HotelManagement onShowToast={addToast} theme={theme} />;
}
