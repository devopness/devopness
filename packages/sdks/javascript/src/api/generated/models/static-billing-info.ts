/* eslint-disable */
/**
 * devopness API
 * Devopness API - Painless essential DevOps to everyone 
 *
 * The version of the OpenAPI document: latest
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { SubscriptionPlan } from './subscription-plan';

/**
 * Information about billing, such as subscription plans.
 * @export
 * @interface StaticBillingInfo
 */
export interface StaticBillingInfo {
    /**
     * The list of subscription plans
     * @type {Array<SubscriptionPlan>}
     * @memberof StaticBillingInfo
     */
    subscription_plans?: Array<SubscriptionPlan>;
}
