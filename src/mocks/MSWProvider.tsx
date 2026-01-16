import { MSWComponent } from './MSWComponent';

export function MSWProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Server-side check: env variable is read on the server during rendering
  const isMswEnabled = process.env.NEXT_PUBLIC_MSW_ENABLED === 'true';

  if (!isMswEnabled) {
    return <>{children}</>;
  }

  return <MSWComponent>{children}</MSWComponent>;
}
