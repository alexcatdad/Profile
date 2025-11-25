import Anthropic from '@anthropic-ai/sdk';

export interface LLMClient {
  generate(prompt: string, options?: { temperature?: number; maxTokens?: number }): Promise<string>;
}

/**
 * Claude API client implementation
 */
export class ClaudeClient implements LLMClient {
  private client: Anthropic;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.ANTHROPIC_API_KEY;
    if (!key) {
      throw new Error('ANTHROPIC_API_KEY environment variable is required for Claude provider');
    }
    this.client = new Anthropic({ apiKey: key });
  }

  async generate(
    prompt: string,
    options: { temperature?: number; maxTokens?: number } = {}
  ): Promise<string> {
    const { temperature = 0.7, maxTokens = 4000 } = options;

    try {
      const message = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: maxTokens,
        temperature,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = message.content[0];
      if (content.type === 'text') {
        return content.text;
      }

      throw new Error('Unexpected response type from Claude API');
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Claude API error: ${error.message}`);
      }
      throw error;
    }
  }
}

/**
 * Ollama client implementation for local LLM
 */
export class OllamaClient implements LLMClient {
  private baseUrl: string;
  private model: string;

  constructor(model: string = 'llama3.1', baseUrl?: string) {
    this.model = model;
    this.baseUrl = baseUrl || process.env.OLLAMA_HOST || 'http://localhost:11434';
  }

  async generate(
    prompt: string,
    options: { temperature?: number; maxTokens?: number } = {}
  ): Promise<string> {
    const { temperature = 0.7, maxTokens = 4000 } = options;

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: false,
          options: {
            temperature,
            num_predict: maxTokens,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama API error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      return data.response || '';
    } catch (error) {
      if (error instanceof Error) {
        // Check if it's a connection error
        if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED')) {
          throw new Error(
            `Cannot connect to Ollama at ${this.baseUrl}. Make sure Ollama is running and the model "${this.model}" is installed.`
          );
        }
        throw new Error(`Ollama error: ${error.message}`);
      }
      throw error;
    }
  }
}

/**
 * Factory function to create the appropriate LLM client
 */
export function createLLMClient(
  provider: 'claude' | 'ollama',
  options?: { model?: string; baseUrl?: string }
): LLMClient {
  switch (provider) {
    case 'claude':
      return new ClaudeClient();
    case 'ollama':
      return new OllamaClient(options?.model, options?.baseUrl);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}
