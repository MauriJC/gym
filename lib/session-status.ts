export const SessionStatus = {
  Active: 1,
  Finalized: 2,
} as const;

export type SessionStatusValue =
  (typeof SessionStatus)[keyof typeof SessionStatus];
