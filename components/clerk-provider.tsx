"use client";

import { ClerkProvider } from '@clerk/nextjs';
import { ReactNode } from 'react';

interface ClerkProviderWrapperProps {
  children: ReactNode;
}

export function ClerkProviderWrapper({ children }: ClerkProviderWrapperProps) {
  // Check if Clerk environment variables are available
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  if (!publishableKey) {
    // Fallback UI when Clerk is not configured
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Secura Password Manager</h1>
          <p className="text-muted-foreground mb-4">
            Authentication is not configured. Please set up Clerk environment variables.
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Required environment variables:</p>
            <code className="bg-muted px-2 py-1 rounded">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      {children}
    </ClerkProvider>
  );
}
