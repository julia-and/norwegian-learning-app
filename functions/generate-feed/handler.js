import { pathToFileURL } from "url";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

const SUBREDDIT_TOPICS = {
  "r/norge": "general Norwegian life, news, culture, society",
  "r/dagliglivet": "daily life, home routines, household topics",
  "r/norskmat": "food, recipes, restaurants, Norwegian cuisine",
  "r/friluftsliv": "outdoor activities, hiking, skiing, nature",
  "r/oslo": "city life, urban topics, Oslo specifically",
  "r/humor": "jokes, funny observations, light-hearted humor",
};

const ALL_SUBREDDITS = Object.keys(SUBREDDIT_TOPICS);

function corsHeaders(origin) {
  const allowed = process.env.ALLOWED_ORIGIN || "*";
  return {
    "Access-Control-Allow-Origin": allowed === "*" ? "*" : origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function buildSystemPrompt(level, subreddits, count) {
  const levelInstructions = {
    A1: `CEFR A1 level: Use ONLY present tense. Maximum 1-2 sentences per post body. Use only the most common Norwegian words (mat, hus, familie, bil, etc). No subordinate clauses. Simple subject-verb-object structure only.`,
    A2: `CEFR A2 level: Use present tense and simple past (preteritum). 2-3 sentences per post body. Basic conjunctions: og, men, fordi, når, så. Simple descriptions and opinions allowed.`,
    B1: `CEFR B1 level: Use varied tenses including present perfect (har + participle). 3-4 sentences per post body. Modal verbs (kan, vil, skal, bør, må). Subordinate clauses with at, som, hvis. Everyday idiomatic phrases.`,
    B2: `CEFR B2 level: Complex sentence structures. 4-6 sentences per post body. Idiomatic expressions, conjunctions like selv om, ettersom, dersom. Nuanced opinions, abstract topics. Natural conversational register.`,
    C1: `CEFR C1 level: Full natural Bokmål register. 5-7 sentences per post body. Sophisticated vocabulary, cultural references, subtle humor or irony where appropriate. Complex subordinate clauses, varied sentence rhythm.`,
  };

  const subredditDescriptions = subreddits
    .map(s => `- ${s}: ${SUBREDDIT_TOPICS[s] || "general topics"}`)
    .join("\n");

  return `You generate fake Norwegian Reddit-style posts for language learners.

Language level: ${levelInstructions[level] || levelInstructions["A2"]}

Available subreddits and their topics:
${subredditDescriptions}

For each post:
- Write realistic Norwegian (Bokmål) content appropriate to the subreddit topic
- Include 2-3 short comments that feel like real replies
- Generate a vocabulary map: 8-15 key words/phrases a learner might not know, as lowercase Norwegian → English translation. Include the words exactly as they appear (or their base form) in the text.
- Fake Norwegian usernames (e.g. fjordmann92, oslogutt, matglad_anne)
- Realistic upvote counts (1-500 for posts, 1-50 for comments)

Generate exactly ${count} posts spread across the provided subreddits.

Respond ONLY with valid JSON in this exact format:
{
  "posts": [
    {
      "subreddit": "r/norge",
      "title": "post title in Norwegian",
      "body": "post body in Norwegian",
      "author": "username",
      "upvotes": 42,
      "comments": [
        { "author": "username2", "body": "comment in Norwegian", "upvotes": 7 }
      ],
      "vocabulary": { "norsk word": "english translation" }
    }
  ]
}`;
}

export const handle = async (event, context, callback) => {
  const origin = event.headers?.origin || "";
  const headers = corsHeaders(origin);

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Server misconfigured: missing API key" }),
    };
  }

  let level, count, subreddits;
  try {
    const body =
      typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    level = body.level;
    count = body.count;
    subreddits = body.subreddits;
  } catch {
    return {
      statusCode: 400,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  const validLevels = ["A1", "A2", "B1", "B2", "C1"];
  if (!level || !validLevels.includes(level)) level = "A2";

  count = Math.max(1, Math.min(10, parseInt(count, 10) || 5));

  if (!Array.isArray(subreddits) || subreddits.length === 0) {
    subreddits = ALL_SUBREDDITS;
  } else {
    subreddits = subreddits.filter(s => ALL_SUBREDDITS.includes(s));
    if (subreddits.length === 0) subreddits = ALL_SUBREDDITS;
  }

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 3000,
        system: buildSystemPrompt(level, subreddits, count),
        messages: [
          {
            role: "user",
            content: `Generate ${count} Norwegian Reddit posts at ${level} level.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      return {
        statusCode: 502,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          error: `Upstream API error (${response.status})`,
        }),
      };
    }

    const data = await response.json();
    const content = data.content?.[0]?.text;
    if (!content) {
      return {
        statusCode: 502,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "No response from upstream API" }),
      };
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        statusCode: 502,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Could not parse feed response" }),
      };
    }

    const result = JSON.parse(jsonMatch[0]);

    // Attach the requested level to each post
    if (Array.isArray(result.posts)) {
      result.posts = result.posts.map(p => ({ ...p, level }));
    }

    return {
      statusCode: 200,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(result),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};

// Local testing
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  import("@scaleway/serverless-functions").then(scw => {
    scw.serveHandler(handle, 8082);
  });
}
