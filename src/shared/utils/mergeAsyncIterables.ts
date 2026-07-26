export interface KeyedAsyncIterable<K extends string, T> {
  key: K;
  iterable: AsyncIterable<T>;
}

/**
 * Interleaves multiple keyed async iterables as their values arrive, instead of
 * exhausting them one at a time. Each source keeps exactly one in-flight `next()`
 * call; whichever resolves first is yielded and immediately replaced.
 */
export async function* mergeAsyncIterables<K extends string, T>(
  sources: KeyedAsyncIterable<K, T>[],
): AsyncGenerator<{ key: K; value: T }> {
  const iterators = sources.map(({ key, iterable }) => ({
    key,
    iterator: iterable[Symbol.asyncIterator](),
  }));

  const pending = new Map(
    iterators.map(
      ({ key, iterator }) => [key, iterator.next().then((result) => ({ key, result }))] as const,
    ),
  );

  while (pending.size > 0) {
    const { key, result } = await Promise.race(pending.values());

    if (result.done) {
      pending.delete(key);
      continue;
    }

    yield { key, value: result.value };

    const entry = iterators.find((item) => item.key === key)!;
    pending.set(
      key,
      entry.iterator.next().then((nextResult) => ({ key, result: nextResult })),
    );
  }
}
