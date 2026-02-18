import DashboardLayout from '@/app/(dashboard)/layout';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
