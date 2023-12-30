/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-14
 **/

const ErrorType = {
  NotFound: 'NotFound',
  InvalidArgument: 'InvalidArgument',
  Unauthorized: 'Unauthorized',
  Forbidden: 'Forbidden',
  Conflict: 'Conflict',
} as const;

export class DomainError extends Error {
  constructor(
    readonly errorType: (typeof ErrorType)[keyof typeof ErrorType],
    readonly code: string,
    readonly message: string,
  ) {
    super(message);
  }
}
