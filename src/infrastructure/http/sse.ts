function formatSSEEvent(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

/**
 * Adapts an async generator into a pull-based SSE stream: the controller only pulls
 * the next value once the client is ready for it, so a slow reader naturally
 * backpressures the generator instead of buffering everything in memory.
 */
export function createSSEStream<T>(
  source: AsyncGenerator<T>,
  toEvent: (item: T) => { event: string; data: unknown },
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const { value, done } = await source.next();

        if (done) {
          controller.enqueue(encoder.encode(formatSSEEvent("done", {})));
          controller.close();
          return;
        }

        const { event, data } = toEvent(value);
        controller.enqueue(encoder.encode(formatSSEEvent(event, data)));
      } catch (error) {
        const message = error instanceof Error ? error.message : "Stream error";
        controller.enqueue(encoder.encode(formatSSEEvent("error", { message })));
        controller.close();
      }
    },
    async cancel() {
      await source.return?.(undefined);
    },
  });
}
