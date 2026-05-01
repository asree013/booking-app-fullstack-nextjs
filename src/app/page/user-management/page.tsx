'use client';

import React, { Suspense } from 'react';

import UserManagementContent from './UserManagementContent';

export default function UserManagementPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserManagementContent />
    </Suspense>
  );
}
