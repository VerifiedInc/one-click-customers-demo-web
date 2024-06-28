type WrappedPromiseEitherResponse<D> =
  | { data: Awaited<D>; error: null }
  | { data: null; error: any };

export async function wrapPromise<D>(
  promise: PromiseLike<D>
): Promise<WrappedPromiseEitherResponse<D>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
