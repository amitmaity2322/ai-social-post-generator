export interface SSEFrame {
  event: string;
  data: unknown;
}

/**
 * Parses a fetch Response body as a Server-Sent Events stream. Frames are
 * separated by a blank line; each frame's `data:` line is JSON-parsed. Generic
 * and vendor-agnostic - has no idea what the data means, only how SSE framing works.
 */
export async function* parseSSEStream(response: Response): AsyncGenerator<SSEFrame> {
  if (!response.body) throw new Error("Response has no body to stream");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const frames = buffer.split("\n\n");
      buffer = frames.pop() ?? "";

      for (const frame of frames) {
        const eventName = frame.match(/^event:\s*(.*)$/m)?.[1]?.trim();
        const dataLine = frame.match(/^data:\s*(.*)$/m)?.[1]?.trim();
        if (!eventName || dataLine === undefined) continue;

        yield { event: eventName, data: JSON.parse(dataLine) };
      }
    }
  } finally {
    reader.releaseLock();
  }
}
