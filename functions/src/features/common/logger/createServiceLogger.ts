import { nanoIdForCorrelationIds } from '../nano/nano';
import { logger } from './logger';

/**
 * Create a service logger for a cloud service 

 * @param serviceName The name of the logger
 */
export function createServiceLogger(serviceName: string) {
  // Always generate a correlation Id
  const correlationId = nanoIdForCorrelationIds();
  const serviceLogger = logger.child({
    service: serviceName,
    cId: correlationId,
  });

  // Need to also set the service name and CID in the default meta data
  serviceLogger.defaultMeta = {
    ...serviceLogger.defaultMeta,
    service: serviceName,
    cid: correlationId,
  };

  return { serviceLogger, serviceName, correlationId };
}
