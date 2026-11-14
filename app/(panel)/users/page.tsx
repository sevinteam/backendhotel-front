'use client';

import React from 'react';
import UserManagement from '@/components/UserManagement';
import { useAdmin } from '@/context/AdminContext';

export default function UsersPage() {
  const { handleNavigate } = useAdmin();

  return <UserManagement onNavigate={handleNavigate} />;
}
