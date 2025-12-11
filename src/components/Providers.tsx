"use client";

import { SessionProvider } from "next-auth/react";

interface Props {
  children: React.ReactNode;
}

const Providers = ({ children }: Props) => {
  return (
    <SessionProvider
      refetchInterval={180} // Refetch session every 3 minutes
      refetchOnWindowFocus={false} // Refetch when window regains focus
    >
      {children}
    </SessionProvider>
  );
};

export default Providers;
