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
