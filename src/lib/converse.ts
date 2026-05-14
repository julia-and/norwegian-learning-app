import type { ConversationScenario } from '@/lib/scenarios';
import { proxyFetch } from '@/lib/api-client';

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
  // Send only the scenario id; the server looks up role/title/maxTurns from
  // its own allowlist. This is the prompt-injection mitigation — the server
  // no longer trusts client-supplied role/title strings.
  return proxyFetch<ConverseTurnResult>(
    CONVERSE_URL,
    {
      messages,
      scenarioId: scenario.id,
      level,
      turnCount,
      maxTurns: scenario.maxTurns,
    },
    {
      required: ['reply'],
      shape: { reply: 'string', isComplete: 'boolean', hint: 'string' },
    },
    'Conversation API',
  );
}
