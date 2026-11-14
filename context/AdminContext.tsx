'use client';

import React, { createContext, useContext } from 'react';
import type { ContactMessage, User } from '@/types';

export interface AdminContextValue {
  theme: string;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  openUserProfiles: User[];
  contactMessages: ContactMessage[];
  setContactMessages: React.Dispatch<React.SetStateAction<ContactMessage[]>>;
  addToast: (message: string, type: 'success' | 'error', onToastClose?: () => void) => void;
  handleNavigate: (view: string, user?: User) => void;
  handleAdminAvatarChange: (newAvatarUrl: string) => void;
  handleTaskStatusChange: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export const AdminProvider = AdminContext.Provider;

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error('useAdmin must be used inside AdminShell');
  }
  return ctx;
}
