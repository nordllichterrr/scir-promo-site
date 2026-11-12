'use client';

import { LabAuthProvider } from '@/components/lab/LabAuth';

export default function LabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LabAuthProvider>{children}</LabAuthProvider>;
}
