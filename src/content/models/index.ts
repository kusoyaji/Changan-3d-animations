import type { Model } from "../types";
import { cs55Phev } from "./cs55-phev";
import { cs55 } from "./cs55";
import { cs35Plus } from "./cs35-plus";
import { cs15 } from "./cs15";
import { uniK } from "./uni-k";
import { alsvin } from "./alsvin";

// Order = showroom priority: the PHEV flagship first, then by segment.
export const allModels: Model[] = [cs55Phev, cs55, cs35Plus, uniK, cs15, alsvin];

export const modelSlugs = allModels.map((m) => m.slug);

export const getModel = (slug: string) => allModels.find((m) => m.slug === slug);
