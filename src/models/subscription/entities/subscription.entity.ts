import { Prisma, SubscriptionPlan, SubscriptionStatus } from '@prisma/client';

/** Describes the properties of a Subscription in the database */
export class Subscription implements Prisma.SubscriptionUncheckedCreateInput {
  /**
   * Subscription ID as UUID
   * @example "6f4ca8a4-8aa0-4302-ac1b-7b5547f01b0a"
   */
  id?: string;

  /**
   * User ID associated with the subscription
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  userId: string;

  /**
   * Subscription plan type
   * @example "PREMIUM"
   */
  plan: SubscriptionPlan;

  /**
   * Subscription status
   * @example "ACTIVE"
   */
  status?: SubscriptionStatus;

  /**
   * Subscription start date
   * @example "2023-01-01T00:00:00.000Z"
   */
  startDate: string | Date;

  /**
   * Subscription end date
   * @example "2023-12-31T23:59:59.999Z"
   */
  endDate: string | Date;

  /**
   * Subscription creation date
   * @example "2023-01-01T00:00:00.000Z"
   */
  createdAt?: string | Date;

  /**
   * Subscription update date
   * @example "2023-01-01T00:00:00.000Z"
   */
  updatedAt?: string | Date;
}
