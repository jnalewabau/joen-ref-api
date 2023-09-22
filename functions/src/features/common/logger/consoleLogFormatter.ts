// spell-checker:ignore logform
import * as logform from 'logform';
import * as winston from 'winston';
/**
 * Logform transformer that allows for the display of service name, function name and correlationIds
 * @param {logform.TransformableInfo} info The info message to process
 * @param {any} opts Any options passed in
 * @return {logform.TransformableInfo | boolean}
 */
function consoleLogFormatter(
  info: logform.TransformableInfo,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  opts?: any,
): logform.TransformableInfo | boolean {
  const logPrefixPattern = opts.logMessagePrefix ?? '';

  // Exit early if no log Prefix pattern is detected
  if (logPrefixPattern.length === 0) {
    return info;
  }

  const { serviceName, functionName, combinedName, cid } = serviceAndFunctionName(
    info.service,
    info.function,
    info.cid,
  );

  const m0 = logPrefixPattern.replace(/{{serviceName}}/g, serviceName);
  const m1 = m0.replace(/{{functionName}}/g, functionName);
  const m2 = m1.replace(/{{serviceAndFunctionName}}/g, combinedName);
  const messagePrefix = m2.replace(/{{cid}}/g, cid);

  if (messagePrefix.length > 0) {
    info.message = `${messagePrefix} - ${info.message}`;
  }

  return info;
}

/**
 * Generate the replaceable values for a log message
 * @param serviceName
 * @param functionName
 * @returns
 */
function serviceAndFunctionName(serviceName: string, functionName: string, cid: string) {
  let combinedName = serviceName ?? '';

  if (functionName) {
    combinedName = functionName;
  }

  if (serviceName && functionName) {
    combinedName = `${serviceName}::${functionName}`;
  }

  const sName = serviceName ?? 'NoServiceName';
  const fName = functionName ?? 'NoFunctionName';

  return {
    serviceName: sName,
    functionName: fName,
    combinedName,
    cid: cid ?? 'NoCid',
  };
}

/**
 * Formatter
 */
export const serviceAndFunctionNameFormatter = winston.format(consoleLogFormatter);
