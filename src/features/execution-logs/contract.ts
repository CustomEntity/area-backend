/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-14
 **/
import { z } from 'zod';

export namespace ExecutionLogAPI {
  export namespace GetExecutionLogsByUser {
    export const userIdSchema = z.string().refine((value) => {
      return value === '@me' || !isNaN(Number(value));
    }, 'Invalid user id');

    export const pageParamSchema = z.coerce.number().min(1).default(1);

    export const limitParamSchema = z.coerce
      .number()
      .min(1)
      .max(20)
      .default(20);
  }

  export namespace GetExecutionLogLogs {
    export const userIdSchema = z.string().refine((value) => {
      return value === '@me' || !isNaN(Number(value));
    }, 'Invalid user id');

    export const pageParamSchema = z.coerce.number().min(1).default(1);

    export const limitParamSchema = z.coerce
      .number()
      .min(1)
      .max(20)
      .default(20);
  }
}
