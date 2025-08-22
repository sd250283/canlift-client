import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractApiPlatformData(data: any) {
  // API Platform Symfony 6.3 uses 'member' for collections
  return data.member || data;
}