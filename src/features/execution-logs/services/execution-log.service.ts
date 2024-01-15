/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-16
 **/

export const EXECUTION_LOG_SERVICE = Symbol('EXECUTION_LOG_SERVICE');

export interface ExecutionLogData {
  id: string;
  appletId: string;
  summary: string;
  executionDate: Date;
}

export const LogLevelMapping = {
  DEBUG: 1,
  INFO: 2,
  WARNING: 3,
  ERROR: 4,
  CRITICAL: 5,
};

export interface ExecutionLogService {
  createExecutionLog(executionlog: ExecutionLogData): Promise<void>;

  log(
    executionLogId: string,
    logLevel: keyof typeof LogLevelMapping,
    message: string,
  ): Promise<void>;
}
