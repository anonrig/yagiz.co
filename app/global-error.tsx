'use client';

import { useEffect } from 'react';

import Container from '@/ui/components/container';

export default function Error({ error }: { error: Error }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <Container>
          <p>Oh no, something went wrong... maybe refresh?</p>
        </Container>
      </body>
    </html>
  );
}
