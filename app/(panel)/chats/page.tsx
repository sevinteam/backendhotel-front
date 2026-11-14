'use client';

import React from 'react';
import UserChatManagement from '@/components/UserChatManagement';
import { useAdmin } from '@/context/AdminContext';

export default function ChatsPage() {
  const { theme, addToast } = useAdmin();

  return <UserChatManagement theme={theme} onShowToast={addToast} />;
}
