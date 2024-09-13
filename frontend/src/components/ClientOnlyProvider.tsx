'use client'; // Mark this as a client component

import { ApolloProvider } from '@apollo/client';
import client from '@/lib/apolloClient';

export default function ClientOnlyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
