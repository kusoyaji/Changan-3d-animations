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
export const MODELS = {
  lean: "fal-ai/kling-video/v1.6/pro/image-to-video",
  premium: "fal-ai/kling-video/v2.1/master/image-to-video",
};

// from/to are KEYFRAMES ids (or generated ids added in Task 4). The proof uses
// two REAL frames only. Full set is completed in Task 5.
export const SEGMENTS = [
  {
    id: "proof_front_to_front34",
    from: "front",
    to: "front34",
    model: MODELS.lean,
    durationSec: 5,
    prompt:
      "Slow cinematic orbit around a parked CS55 PHEV SUV, smooth camera move, the vehicle stays fixed and undistorted, studio black background, photorealistic, no warping of wheels or badges.",
  },
  {
    // Corrected proof: two CONSISTENT real black-bg frames, ending on the real rear.
    id: "proof2_profile_to_rear",
    from: "profile",
    to: "rear",
    model: MODELS.lean,
    durationSec: 5,
    prompt:
      "Smooth cinematic orbit of a parked CS55 PHEV SUV continuing from the side around toward the rear, the vehicle stays perfectly fixed and undistorted, solid pure black studio background, consistent lighting, photorealistic.",
  },
  // full set added in Task 5
];
