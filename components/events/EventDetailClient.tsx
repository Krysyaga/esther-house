"use client";

import { BookTicketButton } from './BookTicketButton';
import type { MappedEvent } from '@/types/infomaniak';

interface EventDetailClientProps {
  event: MappedEvent;
}

export function EventDetailClient({ event }: EventDetailClientProps) {
  return (
    <div className="lg:col-span-1">
      <BookTicketButton event={event} />
    </div>
  );
}
