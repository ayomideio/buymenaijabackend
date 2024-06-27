import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { SubscriptionPlan, SubscriptionStatus } from '@prisma/client';

/** Describes the information to search for subscriptions */
export class FindSubscriptionsDto {
  /** User ID associated with the subscription
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  @IsOptional()
  @IsString()
  userId?: string;

  /** Subscription plan type
   * @example "PREMIUM"
   */
  @IsOptional()
  @IsEnum(SubscriptionPlan)
  plan?: SubscriptionPlan;

  /** Subscription status
   * @example "ACTIVE"
   */
  @IsOptional()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;

  /** Show subscriptions in this page
   * @example 1
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page?: number;

  /** Show this amount of subscriptions per page
   * @example 10
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  offset?: number;
}
