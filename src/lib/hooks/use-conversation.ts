'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db, type ConversationSession } from '@/lib/db';

export function useConversation() {
  const sessions = useLiveQuery(
    () => db.conversationSessions.orderBy('createdAt').reverse().toArray(),
  ) ?? [];

  const saveSession = async (session: Omit<ConversationSession, 'id'>): Promise<string> => {
    const id = crypto.randomUUID();
    await db.conversationSessions.add({ ...session, id });
    return id;
  };

  return { saveSession, sessions };
}
