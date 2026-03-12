import type { ConversationScenario } from '@/lib/scenarios';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ConverseTurnResult {
  reply: string;
  isComplete: boolean;
  hint: string;
}

const CONVERSE_URL = process.env.NEXT_PUBLIC_CONVERSATION_API_URL;

export async function sendConversationTurn(
  messages: ChatMessage[],
  scenario: ConversationScenario,
  level: string,
  turnCount: number,
): Promise<ConverseTurnResult> {
  if (!CONVERSE_URL) {
    throw new Error(
      'Conversation API is not configured. The NEXT_PUBLIC_CONVERSATION_API_URL environment variable is missing.',
    );
  }

  const response = await fetch(CONVERSE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      scenario: {
        id: scenario.id,
        title: scenario.title,
        role: scenario.role,
        situation: scenario.situation,
        openingLine: scenario.openingLine,
      },
      level,
      turnCount,
      maxTurns: scenario.maxTurns,
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(body.error || `API error (${response.status})`);
  }

  return (await response.json()) as ConverseTurnResult;
}
