import { Logger } from 'winston';

/**
 * Create a function logger from a parent
 * @param functionName The name of the logger
 * @param loggerParent The parent logger
 */
export function createFunctionLogger(functionName: string, loggerParent: Logger) {
  // Create a logger and set function name as metadata
  const functionLogger = loggerParent.child({
    function: functionName,
  });

  functionLogger.defaultMeta = {
    ...functionLogger.defaultMeta,
    function: functionName,
  };

  return { functionLogger, functionName };
}
