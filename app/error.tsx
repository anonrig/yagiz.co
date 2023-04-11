'use client';

import Container from '@/ui/components/container';
import { useEffect } from 'react';

export default function Error({ error }: { error: Error }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Container>
      <p>Oh no, something went wrong... maybe refresh?</p>
    </Container>
  );
}
