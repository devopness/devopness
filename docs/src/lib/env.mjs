import { z } from "zod";

export const envSchema = z
  .object({
    // Environment settings
    DEVOPNESS_ENVIRONMENT: z.enum(["dev", "PROD"]),

    // Contact and support information
    DEVOPNESS_COMMUNITY_SUPPORT: z.string().url(),
    DEVOPNESS_GITHUB_CONTACT: z.string().url(),

    // URLs
    DEVOPNESS_URL_DISCORD: z.string().url(),
    DEVOPNESS_URL_ICONS: z.string().url(),
    DEVOPNESS_URL_IMAGES: z.string().url(),
    DEVOPNESS_URL_LINKEDIN: z.string().url(),
    DEVOPNESS_URL_SITE: z.string().url(),
    DEVOPNESS_URL_SIGNUP: z.string().url(),
    DEVOPNESS_URL_WEB_APP: z.string().url(),
    DEVOPNESS_URL_YOUTUBE: z.string().url(),

    // Google Tag Manager
    GOOGLE_TAG_MANAGER_ID: z.string().min(1).startsWith("GTM-").optional(),
  })
  .refine(
    ({ DEVOPNESS_ENVIRONMENT, GOOGLE_TAG_MANAGER_ID }) => {
      const isProd = DEVOPNESS_ENVIRONMENT === "PROD";
      return !isProd || (isProd && GOOGLE_TAG_MANAGER_ID);
    },
    {
      message: "Required in production environment",
      path: ["GOOGLE_TAG_MANAGER_ID"],
    }
  );

/**
 * Maps DEVOPNESS_* and GOOGLE_* environment variables to NEXT_PUBLIC_* equivalents
 */
function mapToPublicEnvVars() {
  Object.entries(process.env).forEach(([key, value]) => {
    if (
      ["DEVOPNESS_", "GOOGLE_"].some((prefix) => key.startsWith(prefix)) &&
      value
    ) {
      const publicKey = `NEXT_PUBLIC_${key}`;
      if (!(publicKey in process.env)) {
        process.env[publicKey] = value;
      }
    }
  });
}

/**
 * Validates environment variables at runtime
 * @throws {Error} if validation fails
 */
export function validateEnv() {
  // Map DEVOPNESS_* vars to NEXT_PUBLIC_* before validation
  mapToPublicEnvVars();

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables");
  }
}
