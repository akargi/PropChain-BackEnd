import { createNamespace, Namespace } from 'cls-hooked';

/**
 * Manages correlation IDs for request tracking using async_hooks (via cls-hooked)
 */
export const CORRELATION_ID_KEY = 'correlationId';

// Create a namespace for correlation IDs
const ns: Namespace = createNamespace('propchain-request');

/**
 * Get the correlation ID for the current request context
 */
export const getCorrelationId = (): string | undefined => {
  return ns.get(CORRELATION_ID_KEY);
};

/**
 * Run a function within a request context and set the correlation ID
 */
export const withCorrelationId = (fn: () => void, correlationId: string): void => {
  ns.run(() => {
    ns.set(CORRELATION_ID_KEY, correlationId);
    fn();
  });
};

/**
 * Get the underlying namespace
 */
export const getNamespace = (): Namespace => {
  return ns;
};
