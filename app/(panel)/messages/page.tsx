'use client';

import React from 'react';
import ContactMessages from '@/components/ContactMessages';
import { useAdmin } from '@/context/AdminContext';

export default function MessagesPage() {
  const { contactMessages, setContactMessages, addToast } = useAdmin();

  return (
    <ContactMessages
      messages={contactMessages}
      onUpdateMessages={setContactMessages}
      onShowToast={addToast}
    />
  );
}
