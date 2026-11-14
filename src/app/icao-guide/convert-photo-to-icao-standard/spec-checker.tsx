"use client";

import { useState } from "react";
import { AlertIcon, CheckIcon, UploadIcon, XIcon } from "@/components/ui/icons";

type Preset = {
  id: string;
  label: string;
  targetWidth: number;
  targetHeight: number;
  physical: string;
  maxKb: number;
  note: string;
};

const presets: Preset[] = [
  {
    id: "in",
    label: "India Passport Seva (630 × 810 px)",
    targetWidth: 630,
    targetHeight: 810,
    physical: "35 × 45 mm (7:9 ratio)",
    maxKb: 250,
    note: "Exact pixel dimensions and JPEG ≤ 250 KB required for Global Passport Seva 2.0.",
  },
  {
    id: "eu",
    label: "Schengen / UK / EU (35 × 45 mm)",
    targetWidth: 413,
    targetHeight: 531,
    physical: "35 × 45 mm (at 300 DPI)",
    maxKb: 500,
    note: "UK digital portal accepts 600 × 750 px minimum; 35 × 45 mm print at 300 DPI is 413 × 531 px.",
  },
  {
    id: "us",
    label: "USA Passport / OCI Print (2 × 2 in)",
    targetWidth: 600,
    targetHeight: 600,
    physical: "51 × 51 mm (1:1 square)",
    maxKb: 240,
    note: "Square 1:1 ratio, 600 × 600 px minimum (up to 1200 × 1200 px) and JPEG ≤ 240 KB.",
  },
  {
    id: "ca",
    label: "Canada Passport Print (50 × 70 mm)",
    targetWidth: 1200,
    targetHeight: 1800,
    physical: "50 × 70 mm (5:7 ratio)",
    maxKb: 4000,
    note: "Canadian passports require commercial-style 50 × 70 mm prints with studio details on the back.",
  },
];

type FileStats = {
  name: string;
  width: number;
  height: number;
  kb: number;
  mime: string;
};

export function SpecChecker() {
  const [presetId, setPresetId] = useState<string>("in");
  const [stats, setStats] = useState<FileStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const preset = presets.find((p) => p.id === presetId) ?? presets[0];

  function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    const objectUrl = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      setStats({
        name: file.name,
        width: img.naturalWidth,
        height: img.naturalHeight,
        kb: Math.round((file.size / 1024) * 10) / 10,
        mime: file.type || "unknown",
      });
      URL.revokeObjectURL(objectUrl);
    };
    img.onerror = () => {
      setError("Could not read image dimensions. If this is an iPhone HEIC file, convert it to JPEG using our photo tool.");
      setStats(null);
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  }

  const targetRatio = preset.targetWidth / preset.targetHeight;
  const currentRatio = stats ? stats.width / stats.height : null;
  const ratioDiff = currentRatio !== null ? Math.abs(currentRatio - targetRatio) / targetRatio : null;

  const exactDimensions = stats ? stats.width === preset.targetWidth && stats.height === preset.targetHeight : false;
  const isJpeg = stats ? stats.mime === "image/jpeg" : false;
  const underMaxKb = stats ? stats.kb <= preset.maxKb : false;
  const ratioMatches = ratioDiff !== null ? ratioDiff <= 0.03 : false;

  return (
    <div className="rounded-lg border border-border bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1">
          <label htmlFor="preset-select" className="block text-sm font-semibold text-black">
            1. Choose your target ICAO standard
          </label>
          <select
            id="preset-select"
            value={presetId}
            onChange={(e) => setPresetId(e.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-black focus:border-lime-600 focus:outline-none"
          >
            {presets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-lime-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-lime-700">
            <UploadIcon className="size-4" />
            <span>2. Inspect a photo file</span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </label>
        </div>
      </div>

      <p className="mt-3 text-xs leading-5 text-gray-500">
        {preset.note} File inspection runs locally in your browser — nothing is uploaded here.
      </p>

      {error && (
        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3.5 text-sm text-amber-900">
          <AlertIcon className="mt-0.5 size-4 shrink-0 text-amber-700" />
          <p>{error}</p>
        </div>
      )}

      {stats && (
        <div className="mt-5 rounded-lg border border-border bg-gray-50 p-4">
          <p className="truncate text-sm font-semibold text-black">{stats.name}</p>
          <dl className="mt-3 grid gap-2.5 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-md border border-border bg-white px-3.5 py-2 text-sm">
              <dt className="text-gray-600">Dimensions</dt>
              <dd className="flex items-center gap-1.5 font-semibold text-black">
                {exactDimensions ? (
                  <CheckIcon className="size-4 text-lime-600" />
                ) : (
                  <XIcon className="size-4 text-red-600" />
                )}
                {stats.width} × {stats.height} px
              </dd>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border bg-white px-3.5 py-2 text-sm">
              <dt className="text-gray-600">File size</dt>
              <dd className="flex items-center gap-1.5 font-semibold text-black">
                {underMaxKb ? (
                  <CheckIcon className="size-4 text-lime-600" />
                ) : (
                  <XIcon className="size-4 text-red-600" />
                )}
                {stats.kb} KB (max {preset.maxKb} KB)
              </dd>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border bg-white px-3.5 py-2 text-sm">
              <dt className="text-gray-600">Format</dt>
              <dd className="flex items-center gap-1.5 font-semibold text-black">
                {isJpeg ? (
                  <CheckIcon className="size-4 text-lime-600" />
                ) : (
                  <XIcon className="size-4 text-red-600" />
                )}
                {stats.mime}
              </dd>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border bg-white px-3.5 py-2 text-sm">
              <dt className="text-gray-600">Aspect ratio</dt>
              <dd className="flex items-center gap-1.5 font-semibold text-black">
                {ratioMatches ? (
                  <CheckIcon className="size-4 text-lime-600" />
                ) : (
                  <XIcon className="size-4 text-red-600" />
                )}
                {ratioMatches ? "Matches target" : `Needs ${preset.physical} crop`}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}

