export type Ok<T> = { ok: true; value: T };
export type Error<E> = { ok: false; error: E };

export type Result<T, E> = Error<E> | Ok<T>;

export function ok<T>(v: T): Result<T, never> {
  return { ok: true, value: v };
}

export function err<E>(e: E): Result<never, E> {
  return { ok: false, error: e };
}

export type Wrap<T, E> = {
  result: () => Promise<Result<T, E>> | Result<T, E>;
  ifOkThen: <X, Y>(
    fn: (v: T) => Promise<Result<X, Y>> | Result<X, Y>,
  ) => Wrap<X, Y | E>;
  ifErrThen: <X, Y>(
    fn: (v: E) => Promise<Result<X, Y>> | Result<X, Y>,
  ) => Wrap<X | T, Y>;
};

function isPromise<T = any>(value: any): value is Promise<T> {
  return Boolean(value && typeof value.then === "function");
}

export function wrap<T, E>(
  result: Promise<Result<T, E>> | Result<T, E>,
): Wrap<T, E> {
  return {
    result: () => result,
    ifOkThen: <X, Y>(fn: (v: T) => Promise<Result<X, Y>> | Result<X, Y>) => {
      if (isPromise(result)) {
        return wrap(
          result.then<Result<X, Y | E>>((v) => {
            if (v.ok) {
              return fn(v.value);
            }

            return err(v.error);
          }),
        );
      } else {
        if (result.ok) {
          return wrap(fn(result.value));
        }

        return wrap(err(result.error));
      }
    },
    ifErrThen: <X, Y>(fn: (v: E) => Promise<Result<X, Y>> | Result<X, Y>) => {
      if (isPromise(result)) {
        return wrap(
          result.then<Result<X | T, Y>>((v) => {
            if (v.ok) {
              return ok(v.value);
            }

            return fn(v.error);
          }),
        );
      } else {
        if (result.ok) {
          return wrap(ok(result.value));
        }

        return wrap(fn(result.error));
      }
    },
  };
}
