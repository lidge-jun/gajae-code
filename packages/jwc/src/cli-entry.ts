/**
 * Bundle-only entry (P12/063.1) — bin/jwc.js must stay out of the bundle
 * graph or the published bundle would dynamically import itself.
 */
process.env.JWC_BRAND_NAME = "jwc";
process.env.GJC_BRAND_NAME = "jwc"; // legacy alias for older read sites
await import("@gajae-code/coding-agent/cli");
