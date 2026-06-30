import path from "node:path";
const ROOT = process.cwd();
export const CANVAS = { w: 1920, h: 1080 };
export const FRAME_COUNT = 120;
export const MOBILE_FRAME_COUNT = 60;
export const WORK = path.join(ROOT, "scripts/3d/work");
export const OUT = path.join(ROOT, "public/images/model/cs55-phev/3d");
const SRC = path.join(ROOT, "public/images/CS55PHEV-ImagesFor3D");

// Real studio stills (right side + front + rear) and interior. Generated
// keyframes (aerial, left flank) are produced into WORK/keyframes in Task 4.
export const KEYFRAMES = {
  front: path.join(SRC, "CS55 PHEV FACE MOBILE.jpg"),
  front34: path.join(SRC, "CS55 PHEV 2 face droite.png"),
  profile: path.join(SRC, "CS55 PHEV Horizontal with bg copie.png"),
  rear34: path.join(SRC, "CS55PHEV 1 arriere droite.png"),
  rear: path.join(SRC, "CS55 PHEV arriere.png"),
  interior: path.join(SRC, "CS55 PHEV Sellerie en cuir.jpg"),
};

// Verified 2026-06-30 (fal.ai API pages):
//  - Kling 1.6 Pro i2v: input { prompt, image_url (start, required),
//    tail_image_url (end keyframe, optional), duration "5"|"10", aspect_ratio "16:9", cfg_scale }.
//  - Luma Dream Machine is DEPRECATED → not used.
//  - premium escalation = Kling 2.x master (verify tail_image_url support before first premium use).
// Verified 2026-06-30: v2.1 MASTER does NOT accept tail_image_url (start-frame only),
// so it's unusable for keyframe-pinned orbit. v2.1 PRO DOES accept tail_image_url → our premium.
export const MODELS = {
  lean: "fal-ai/kling-video/v1.6/pro/image-to-video",
  premium: "fal-ai/kling-video/v2.1/pro/image-to-video",
};

// from/to are KEYFRAMES ids (or generated ids added in Task 4). The proof uses
// two REAL frames only. Full set is completed in Task 5.
const ORBIT_PROMPT =
  "Smooth slow cinematic turntable orbit around a parked CS55 PHEV SUV, the vehicle stays perfectly fixed, rigid and undistorted, solid pure black studio background, consistent studio lighting, photorealistic, no warping of wheels or badges.";

// Full 360 ring as short ~45 adjacent hops. Right flank = real frames (front34,
// profile, rear34, rear). Left flank = mirrored frames (front34L, profileL, rear34L,
// created by 02b-mirror-keyframes.mjs). rear is symmetric and bridges the two halves.
export const SEGMENTS = [
  { id: "h1_front34_profile",  from: "front34",  to: "profile",  model: MODELS.premium, durationSec: 5, prompt: ORBIT_PROMPT },
  { id: "h2_profile_rear34",   from: "profile",  to: "rear34",   model: MODELS.premium, durationSec: 5, prompt: ORBIT_PROMPT },
  { id: "h3_rear34_rear",      from: "rear34",   to: "rear",     model: MODELS.premium, durationSec: 5, prompt: ORBIT_PROMPT },
  { id: "h4_rear_rear34L",     from: "rear",     to: "rear34L",  model: MODELS.premium, durationSec: 5, prompt: ORBIT_PROMPT },
  { id: "h5_rear34L_profileL", from: "rear34L",  to: "profileL", model: MODELS.premium, durationSec: 5, prompt: ORBIT_PROMPT },
  { id: "h6_profileL_front34L",from: "profileL", to: "front34L", model: MODELS.premium, durationSec: 5, prompt: ORBIT_PROMPT },
  { id: "h7_front34L_front34", from: "front34L", to: "front34",  model: MODELS.premium, durationSec: 5, prompt: ORBIT_PROMPT + " The camera passes across the front of the vehicle." },
];
