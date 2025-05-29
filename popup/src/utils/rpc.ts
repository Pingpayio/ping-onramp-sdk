import { retry } from "@lifeomic/attempt"
import * as v from "valibot"

// Copy of https://github.com/sindresorhus/is-network-error/blob/main/index.js

const objectToString = Object.prototype.toString

const isError = (value: unknown): value is Error =>
  objectToString.call(value) === "[object Error]" || value instanceof Error

const errorMessages = new Set([
  "network error", // Chrome
  "Failed to fetch", // Chrome
  "NetworkError when attempting to fetch resource.", // Firefox
  "The Internet connection appears to be offline.", // Safari 16
  "Load failed", // Safari 17+
  "Network request failed", // `cross-fetch`
  "fetch failed", // Undici (Node.js)
  "terminated", // Undici (Node.js)
])

export function isNetworkError(error: unknown) {
  if (error instanceof Error) {
    const isValid =
      error &&
      isError(error) &&
      error.name === "TypeError" &&
      typeof error.message === "string"

    if (!isValid) {
      return false
    }

    // We do an extra check for Safari 17+ as it has a very generic error message.
    // Network errors in Safari have no stack.
    if (error.message === "Load failed") {
      return error.stack === undefined
    }

    return errorMessages.has(error.message)
  }
}

export type ErrorType<name extends string = "Error"> = Error & { name: name }

export type WithTimeoutErrorType = ErrorType

export function withTimeout<data>(
  fn: ({
    signal,
  }: { signal: AbortController["signal"] | null }) => Promise<data>,
  {
    errorInstance = new Error("timed out"),
    timeout,
    signal,
  }: {
    // The error instance to throw when the timeout is reached.
    errorInstance?: Error | undefined
    // The timeout (in ms).
    timeout: number
    // Whether or not the timeout should use an abort signal.
    signal?: boolean | undefined
  }
): Promise<data> {
  return new Promise((resolve, reject) => {
    ; (async () => {
      let timeoutId!: NodeJS.Timeout
      try {
        const controller = new AbortController()
        if (timeout > 0) {
          timeoutId = setTimeout(() => {
            if (signal) {
              controller.abort()
            } else {
              reject(errorInstance)
            }
          }, timeout) as NodeJS.Timeout // need to cast because bun globals.d.ts overrides @types/node
        }
        resolve(await fn({ signal: controller?.signal || null }))
      } catch (err) {
        if ((err as Error)?.name === "AbortError") reject(errorInstance)
        reject(err)
      } finally {
        clearTimeout(timeoutId)
      }
    })()
  })
}

type SuccessResult<result> = {
  result: result
  error?: undefined
}
type ErrorResult<error> = {
  result?: undefined
  error: error
}
export type RpcResponse<TResult = unknown, TError = unknown> = {
  jsonrpc: `${number}`
  id: number | string
} & (SuccessResult<TResult> | ErrorResult<TError>)

export async function handleRPCResponse<
  TSchema extends v.BaseSchema<TInput, TOutput, TIssue>,
  TInput,
  TOutput extends RpcResponse<
    unknown,
    { code: number; data: unknown; message: string }
  >,
  TIssue extends v.BaseIssue<unknown>,
>(response: Response, body: unknown, schema: TSchema) {
  const json = await response.json()

  const parsed = v.safeParse(schema, json)
  if (parsed.success) {
    if (parsed.output.error !== undefined) {
      throw new RpcRequestError({
        body,
        error: parsed.output.error,
        url: response.url,
      })
    }

    return parsed.output.result
  }

  throw new RpcRequestError({
    body,
    error: { code: -1, data: json, message: "Invalid response" },
    url: response.url,
  })
}

/**
 * Get the reference key for the circular value
 *
 * @param keys the keys to build the reference key from
 * @param cutoff the maximum number of keys to include
 * @returns the reference key
 */
function getReferenceKey(keys: string[], cutoff: number) {
  return keys.slice(0, cutoff).join(".") || "."
}

/**
 * Faster `Array.prototype.indexOf` implementation build for slicing / splicing
 *
 * @param array the array to match the value in
 * @param value the value to match
 * @returns the matching index, or -1
 */
function getCutoff(array: unknown[], value: unknown) {
  const { length } = array

  for (let index = 0; index < length; ++index) {
    if (array[index] === value) {
      return index + 1
    }
  }

  return 0
}
type StandardReplacer = (key: string, value: unknown) => unknown
type CircularReplacer = (key: string, value: unknown, referenceKey: string) => unknown

/**
 * Create a replacer method that handles circular values
 *
 * @param [replacer] a custom replacer to use for non-circular values
 * @param [circularReplacer] a custom replacer to use for circular methods
 * @returns the value to stringify
 */
function createReplacer(
  replacer?: StandardReplacer | null | undefined,
  circularReplacer?: CircularReplacer | null | undefined
): StandardReplacer {
  const hasReplacer = typeof replacer === "function"
  const hasCircularReplacer = typeof circularReplacer === "function"


  const cache: unknown[] = []
  const keys: string[] = []


  return function replace(this: unknown, key: string, value: unknown) {
    if (typeof value === "object") {
      if (cache.length) {
        const thisCutoff = getCutoff(cache, this)

        if (thisCutoff === 0) {
          cache[cache.length] = this
        } else {
          cache.splice(thisCutoff)
          keys.splice(thisCutoff)
        }

        keys[keys.length] = key

        const valueCutoff = getCutoff(cache, value)

        if (valueCutoff !== 0) {
          return hasCircularReplacer
            ? circularReplacer.call(
              this,
              key,
              value,
              getReferenceKey(keys, valueCutoff)
            )
            : `[ref=${getReferenceKey(keys, valueCutoff)}]`
        }
      } else {
        cache[0] = value
        keys[0] = key
      }
    }

    return hasReplacer ? replacer.call(this, key, value) : value
  }
}

/**
 * Stringifier that handles circular values
 *
 * Forked from https://github.com/planttheidea/fast-stringify
 *
 * @param value to stringify
 * @param [replacer] a custom replacer function for handling standard values
 * @param [indent] the number of spaces to indent the output by
 * @param [circularReplacer] a custom replacer function for handling circular values
 * @returns the stringified output
 */
export function serialize(
  value: unknown,
  replacer?: StandardReplacer | null | undefined,
  indent?: number | null | undefined,
  circularReplacer?: CircularReplacer | null | undefined
) {
  return JSON.stringify(
    value,
    createReplacer((key, value_) => {
      let value = value_
      if (typeof value === "bigint")
        value = { __type: "bigint", value: (value_ as bigint).toString() }
      if (value instanceof Map)
        value = { __type: "Map", value: Array.from((value_ as Map<unknown, unknown>).entries()) }
      return replacer?.(key, value) ?? value
    }, circularReplacer),
    indent ?? undefined
  )
}

type BaseErrorParameters = {
  cause?: unknown
  details?: string | undefined
  metaMessages?: string[] | undefined
  name?: string | undefined
}

export type BaseErrorType = BaseError & { name: "BaseError" }
export class BaseError extends Error {
  details: string
  metaMessages?: string[] | undefined
  shortMessage: string

  override name = "BaseError"

  constructor(shortMessage: string, args: BaseErrorParameters = {}) {
    const details = (() => {
      if (args.cause instanceof BaseError) return args.cause.details
      if (
        args.cause != null &&
        typeof args.cause === "object" &&
        "message" in args.cause &&
        typeof args.cause.message === "string"
      ) {
        return args.cause.message
      }
      return args.details ?? ""
    })()

    const message = [
      shortMessage || "An error occurred.",
      "",
      ...(args.metaMessages ? [...args.metaMessages, ""] : []),
      ...(details ? [`Details: ${details}`] : []),
    ].join("\n")

    super(message, args.cause ? { cause: args.cause } : undefined)

    this.details = details
    this.metaMessages = args.metaMessages
    this.name = args.name ?? this.name
    this.shortMessage = shortMessage
  }

  walk(): Error
  walk(fn: (err: unknown) => boolean): Error | null
  walk(fn?: (err: unknown) => boolean): unknown {
    return walk(this, fn)
  }
}

function walk(
  err: unknown,
  fn?: ((err: unknown) => boolean) | undefined
): unknown {
  if (fn?.(err)) return err
  if (
    err &&
    typeof err === "object" &&
    "cause" in err &&
    err.cause !== undefined
  )
    return walk(err.cause, fn)
  return fn ? null : err
}

const rpcResponseSchema = v.union([
  // success
  v.object({
    jsonrpc: v.literal("2.0"),
    id: v.string(),
    result: v.unknown(),
  }),
  // error
  v.object({
    jsonrpc: v.literal("2.0"),
    id: v.string(),
    error: v.pipe(
      v.string(),
      v.transform((v) => {
        return {
          code: -1,
          data: null,
          message: v,
        }
      })
    ),
  }),
])



export type HttpRequestErrorType = HttpRequestError & {
  name: "HttpRequestError"
}
export class HttpRequestError extends BaseError {
  body?: unknown | undefined
  headers?: Headers | undefined
  status?: number | undefined
  url: string

  constructor({
    body,
    cause,
    details,
    headers,
    status,
    url,
  }: {
    body?: unknown | undefined
    cause?: Error | undefined
    details?: string | undefined
    headers?: Headers | undefined
    status?: number | undefined
    url: string
  }) {
    super("HTTP request failed.", {
      cause,
      details,
      metaMessages: [
        status && `Status: ${status}`,
        `URL: ${url}`,
        body && `Request body: ${serialize(body)}`,
      ].filter(Boolean) as string[],
      name: "HttpRequestError",
    })
    this.body = body
    this.headers = headers
    this.status = status
    this.url = url
  }
}

export type RpcRequestErrorType = RpcRequestError & {
  name: "RpcRequestError"
}
export class RpcRequestError extends BaseError {
  code: number
  data?: unknown

  constructor({
    body,
    error,
    url,
  }: {
    body: unknown
    error: { code: number; data?: unknown; message: string }
    url: string
  }) {
    super("RPC Request failed.", {
      cause: error as unknown,
      details: error.message,
      metaMessages: [`URL: ${url}`, `Request body: ${serialize(body)}`],
      name: "RpcRequestError",
    })
    this.code = error.code
    this.data = error.data
  }
}

export type TimeoutErrorType = TimeoutError & {
  name: "TimeoutError"
}
export class TimeoutError extends BaseError {
  constructor({
    body,
    url,
  }: {
    body: unknown
    url: string
  }) {
    super("The request took too long to respond.", {
      details: "The request timed out.",
      metaMessages: [`URL: ${url}`, `Request body: ${serialize(body)}`],
      name: "TimeoutError",
    })
  }
}

export function requestShouldRetry(error: Error) {
  if (error instanceof HttpRequestError && error.status != null) {
    // Forbidden
    if (error.status === 403) return true
    // Request Timeout
    if (error.status === 408) return true
    // Request Entity Too Large
    if (error.status === 413) return true
    // Too Munknown Requests
    if (error.status === 429) return true
    // Internal Server Error
    if (error.status === 500) return true
    // Bad Gateway
    if (error.status === 502) return true
    // Service Unavailable
    if (error.status === 503) return true
    // Gateway Timeout
    if (error.status === 504) return true
    return false
  }
  return true
}

export type RequestConfig = {
  requestId?: string | undefined
  timeout?: number | undefined
  fetchOptions?: Omit<RequestInit, "body"> | undefined
}

export type JSONRPCRequest<Method, Params> = {
  id: string
  jsonrpc: "2.0"
  method: Method
  params: Params[]
}

export async function jsonRPCRequest<
  T extends JSONRPCRequest<unknown, unknown>,
>(
  method: T["method"],
  params: T["params"][0],
  config?: RequestConfig | undefined
) {
  const url = "https://bridge.chaindefuser.com/rpc"

  const body = {
    id: config?.requestId ?? "dontcare",
    jsonrpc: "2.0",
    method,
    params: params !== undefined ? [params] : undefined,
  }

  const response = await retry(
    () => {
      return request({
        url,
        body,
        ...config,
        fetchOptions: {
          ...config?.fetchOptions,
          method: "POST",
        },
      })
    },
    {
      delay: 200,
      maxAttempts: 3,
      handleError: (err, context) => {
        if (!requestShouldRetry(err)) {
          context.abort()
        }
      },
    }
  )

  return handleRPCResponse(response, body, rpcResponseSchema)
}

export type RequestErrorType = HttpRequestError | TimeoutError

export async function request({
  url,
  body,
  timeout = 10_000,
  fetchOptions,
}: {
  url: string | URL
  body?: unknown | undefined
  timeout?: number | undefined
  fetchOptions?: Omit<RequestInit, "body"> | undefined
}): Promise<Response> {
  const { headers, method, signal: signal_ } = fetchOptions ?? {}

  try {
    const response = await withTimeout(
      ({ signal }) => {
        return fetch(url, {
          ...fetchOptions,
          method: method,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: JSON.stringify(body),
          signal: signal_ || (timeout > 0 ? signal : null),
        })
      },
      {
        errorInstance: new TimeoutError({ body, url: url.toString() }),
        timeout,
        signal: true,
      }
    )

    if (!response.ok) {
      throw new HttpRequestError({
        body,
        details: response.statusText,
        headers: response.headers,
        status: response.status,
        url: url.toString(),
      })
    }

    return response
  } catch (err: unknown) {
    if (err instanceof HttpRequestError) throw err
    if (err instanceof TimeoutError) throw err

    if (isNetworkError(err)) {
      throw new HttpRequestError({
        body,
        cause: err as Error,
        url: url.toString(),
      })
    }

    throw err
  }
}