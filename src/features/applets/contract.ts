/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2023-12-30
 **/
import { z } from 'zod';

export namespace AppletAPI {
  export namespace CreateApplet {
    const TriggerDataSchema = z.record(
      z.union([
        z.string(),
        z.number(),
        z.boolean(),
        z.array(z.union([z.string(), z.number(), z.boolean()])),
      ]),
    );

    const ReactionParametersDataSchema = z.nullable(
      z.record(
        z.union([
          z.string(),
          z.number(),
          z.boolean(),
          z.array(z.union([z.string(), z.number(), z.boolean()])),
        ]),
      ),
    );

    export const userIdSchema = z.string().refine((value) => {
      return value === '@me' || !isNaN(Number(value));
    }, 'Invalid user id');

    export const schema = z.object({
      name: z.string().min(1),
      description: z.string().min(1),
      eventId: z.string(),
      reactionId: z.string(),
      eventConnectionId: z.string().optional(),
      reactionConnectionId: z.string().optional(),
      eventTriggerData: TriggerDataSchema,
      reactionParametersData: ReactionParametersDataSchema,
    });

    export const openApiSchema = {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 1 },
        description: { type: 'string', minLength: 1 },
        eventId: { type: 'string' },
        reactionId: { type: 'string' },
        eventConnectionId: { type: 'string' },
        reactionConnectionId: { type: 'string' },
        eventTriggerData: {
          type: 'object',
          additionalProperties: true,
        },
        reactionParametersData: {
          type: 'object',
          additionalProperties: true,
        },
      },
      example: {
        name: 'My first applet',
        description: 'This is my first applet',
        eventId: '1',
        reactionId: '1',
        eventConnectionId: '1212312321112323',
        reactionConnectionId: '1312312321112323',
        eventTriggerData: {
          repository: 'CustomEntity/MyRepository',
        },
        reactionParametersData: {
          repository: 'CustomEntity/MyRepository',
          title: 'My issue title',
          body: 'My issue body',
        },
      },
    };

    export type Request = z.infer<typeof schema>;
  }

  export namespace GetApplet {
    export const userIdSchema = z.string().refine((value) => {
      return value === '@me' || !isNaN(Number(value));
    }, 'Invalid user id');

    export const appletIdSchema = z.string().refine((value) => {
      return !isNaN(Number(value));
    }, 'Invalid applet id');
  }

  export namespace GetUserApplets {
    export const userIdSchema = z.string().refine((value) => {
      return value === '@me' || !isNaN(Number(value));
    }, 'Invalid user id');
  }

  export namespace DeleteApplet {
    export const userIdSchema = z.string().refine((value) => {
      return value === '@me' || !isNaN(Number(value));
    }, 'Invalid user id');

    export const appletIdSchema = z.string().refine((value) => {
      return !isNaN(Number(value));
    }, 'Invalid applet id');
  }

  export namespace EditApplet {
    const TriggerDataSchema = z.record(
      z.union([
        z.string(),
        z.number(),
        z.boolean(),
        z.array(z.union([z.string(), z.number(), z.boolean()])),
      ]),
    );

    const ReactionParametersDataSchema = z.nullable(
      z.record(
        z.union([
          z.string(),
          z.number(),
          z.boolean(),
          z.array(z.union([z.string(), z.number(), z.boolean()])),
        ]),
      ),
    );

    export const userIdSchema = z.string().refine((value) => {
      return value === '@me' || !isNaN(Number(value));
    }, 'Invalid user id');

    export const appletIdSchema = z.string().refine((value) => {
      return !isNaN(Number(value));
    }, 'Invalid applet id');

    export const schema = z.object({
      name: z.string().min(1).optional(),
      description: z.string().min(1).optional(),
      eventId: z.string().optional(),
      reactionId: z.string().optional(),
      eventConnectionId: z.string().optional(),
      reactionConnectionId: z.string().optional(),
      eventTriggerData: TriggerDataSchema.optional(),
      reactionParametersData: ReactionParametersDataSchema.optional(),
      active: z.boolean().optional(),
    });

    export const openApiSchema = {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 1 },
        description: { type: 'string', minLength: 1 },
        eventId: { type: 'string' },
        reactionId: { type: 'string' },
        eventConnectionId: { type: 'string' },
        reactionConnectionId: { type: 'string' },
        eventTriggerData: {
          type: 'object',
          additionalProperties: true,
        },
        reactionParametersData: {
          type: 'object',
          additionalProperties: true,
        },
        active: { type: 'boolean' },
      },
      example: {
        name: 'My new applet name',
        description: 'My new applet description',
        eventId: '1',
        reactionId: '1',
        eventConnectionId: '1212312321112323',
        reactionConnectionId: '1312312321112323',
        eventTriggerData: {
          repository: 'CustomEntity/MyRepository',
        },
        reactionParametersData: {
          repository: 'CustomEntity/MyRepository',
          title: 'My new issue title',
          body: 'My new issue body',
        },
        active: true,
      },
    };

    export type Request = z.infer<typeof schema>;
  }
}
