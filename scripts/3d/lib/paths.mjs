export function padIndex(i, width = 4) {
  return String(i).padStart(width, "0");
}
export function buildFramePath(template, i) {
  return template.replace("{i}", padIndex(i));
}
export function buildManifest({ frameCount, mobileFrameCount }) {
  const dir = "/images/model/cs55-phev/3d";
  return {
    frameCount,
    mobileFrameCount,
    framePath: `${dir}/desktop/{i}.avif`,
    mobileFramePath: `${dir}/mobile/{i}.avif`,
    poster: `${dir}/poster.avif`,
    webpFallback: true,
  };
}
