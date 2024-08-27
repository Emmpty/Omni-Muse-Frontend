import { z } from 'zod';
import dayjs from 'dayjs';
import { getSanitizedStringSchema } from '~/server/schema/utils.schema';
export const eventSchema = z.object({
  event: z.string(),
});
export type EventInput = z.infer<typeof eventSchema>;

export type TeamScoreHistoryInput = z.infer<typeof teamScoreHistorySchema>;
export const teamScoreHistorySchema = eventSchema.extend({
  window: z.enum(['hour', 'day', 'week', 'month', 'year']).optional(),
  start: z.date().optional(),
});

export type CreateEventInput = z.infer<typeof createEventInputSchema>;
export const createEventInputSchema = z.object({
  name: z.string().trim().nonempty(),
  description: getSanitizedStringSchema().refine((data) => {
    return data && data.length > 0 && data !== '<p></p>';
  }, 'Cannot be empty'),
  expiresAt: z
    .date()
    .min(dayjs().add(1, 'day').startOf('day').toDate(), 'Expiration date must be in the future'),
  startsAt: z.date().min(dayjs().startOf('day').toDate(), 'Start date must be in the future'),

  nsfw: z.boolean().optional(),
  poi: z.boolean().optional(),
  ownRights: z.boolean().optional(),
});

export type UpdateEventInput = z.infer<typeof updateEventInputSchema>;
export const updateEventInputSchema = createEventInputSchema
  .pick({
    name: true,
    description: true,
    poi: true,
    nsfw: true,
    ownRights: true,
    images: true,
    lockedProperties: z.string().array().optional(),
  })
  .extend({
    id: z.number(),
    startsAt: z.date(),
    expiresAt: z
      .date()
      .min(dayjs().add(1, 'day').startOf('day').toDate(), 'Expiration date must be in the future'),
  });

export type UpsertEventInput = z.infer<typeof upsertEventInputSchema>;

export const upsertEventInputSchema = z.object({
  title: z.string().trim().nonempty(),
  content: getSanitizedStringSchema().refine((data) => {
    return data && data.length > 0 && data !== '<p></p>';
  }, 'Cannot be empty'),
  raceStart: z.date(),
  // .min(dayjs().startOf('day').toDate(), 'Start date must be in the future')
  raceFinish: z
    .date()
    .min(dayjs().add(1, 'day').startOf('day').toDate(), 'Expiration date must be in the future'),
});
