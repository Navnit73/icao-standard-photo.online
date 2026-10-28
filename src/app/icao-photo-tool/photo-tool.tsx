"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { countries, flagEmoji, getCountry, type Country } from "@/config/countries";
import {
  AlertIcon,
  CheckIcon,
  ChevronDownIcon,
  ImageIcon,
  SearchIcon,
  UploadIcon,
  XIcon,
} from "@/components/ui/icons";

const POPULAR = ["US", "GB", "IN", "EU", "CA", "AU"];
const MAX_MB = 10;

const STAGES = ["Uploading your photo", "Removing the background", "Cropping to the official size", "Running ICAO checks"];
/** Processing always shows for at least this long, even when the API is faster */
const MIN_PROCESSING_MS = 10_000;
const STAGE_MS = MIN_PROCESSING_MS / STAGES.length;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type Status = { kind: "idle" } | { kind: "processing"; stage: number } | { kind: "error"; message: string };

export function PhotoTool() {
  const router = useRouter();
  const [country, setCountry] = useState<Country | undefined>(getCountry("US"));
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const busy = status.kind === "processing";

  // Starts as soon as a photo is chosen, so there's no extra button to click
  async function process(file: File) {
    if (!country || busy) return;
    setStatus({ kind: "processing", stage: 0 });
    // The API doesn't report progress, so step through the stages on a timer
    const timer = setInterval(
      () => setStatus((s) => (s.kind === "processing" ? { ...s, stage: Math.min(s.stage + 1, STAGES.length - 1) } : s)),
      STAGE_MS,
    );
    const minDuration = wait(MIN_PROCESSING_MS);

    try {
      const body = new FormData();
      body.append("image", file);
      body.append("country_code", country.code);
      const res = await fetch("/api/photos", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.id) throw new Error(data.error ?? "Something went wrong. Please try again.");

      await minDuration;
      clearInterval(timer);
      // Tick off the last step and fill the bar before leaving
      setStatus({ kind: "processing", stage: STAGES.length });
      await wait(600);

      // Reset first so the tool is ready again if the user comes back
      setFile(null);
      setStatus({ kind: "idle" });
      router.push(`/photo-preview/${data.id}`);
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    } finally {
      clearInterval(timer);
    }
  }

  return (
    <div className="rounded-lg border border-border bg-white shadow-sm">
      <Step n={1} title="Choose your country">
        <CountryPicker value={country} onChange={setCountry} disabled={busy} />
      </Step>

      <Step n={2} title="Upload your photo">
        <Dropzone
          file={file}
          disabled={busy}
          onFile={(f) => {
            setFile(f);
            if (f) process(f);
            else setStatus({ kind: "idle" });
          }}
          onError={(message) => setStatus({ kind: "error", message })}
        />
      </Step>

      <div className="border-t border-border p-5 sm:p-6">
        {busy && <Progress stage={status.stage} />}

        {status.kind === "error" && (
          <div role="alert" className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 sm:flex-row sm:items-center">
            <p className="flex flex-1 items-start gap-2.5 text-sm text-red-700">
              <AlertIcon className="mt-0.5 size-4" />
              {status.message}
            </p>
            {file && (
              <button
                type="button"
                onClick={() => process(file)}
                className="h-9 shrink-0 rounded-lg border border-red-200 bg-white px-4 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
              >
                Try again
              </button>
            )}
          </div>
        )}

        <p className={`text-center text-xs text-gray-500 ${status.kind === "idle" ? "" : "mt-3"}`}>
          Processing starts as soon as you add a photo. Photos are deleted automatically within{" "}
          {siteConfig.privacy.deleteAfterHours} hours.
        </p>
      </div>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b border-border p-5 last-of-type:border-b-0 sm:p-6">
      <legend className="contents">
        <span className="mb-4 flex items-center gap-3 text-base font-semibold text-black">
          <span className="flex size-6 items-center justify-center rounded-md bg-black font-mono text-xs text-white">{n}</span>
          {title}
        </span>
      </legend>
      {children}
    </fieldset>
  );
}

function CountryPicker({
  value,
  onChange,
  disabled,
}: {
  value?: Country;
  onChange: (c: Country) => void;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const listId = useId();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? countries.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase() === q) : countries;
  }, [query]);

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  function pick(c: Country) {
    onChange(c);
    setOpen(false);
    setQuery("");
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[highlight]) pick(results[highlight]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={root}>
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            setOpen((v) => !v);
            setHighlight(0);
          }}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={`flex h-12 w-full items-center gap-3 rounded-lg border bg-white px-3.5 text-left transition-colors disabled:opacity-60 ${
            open ? "border-lime-600 ring-2 ring-lime-600/15" : "border-gray-300 hover:border-gray-400"
          }`}
        >
          {value ? (
            <>
              <span className="text-xl leading-none">{flagEmoji(value)}</span>
              <span className="flex-1 truncate text-sm font-medium text-black">{value.name} passport</span>
              <span className="hidden font-mono text-xs text-gray-500 sm:inline">{value.dimensions.replace("x", " × ")} px</span>
            </>
          ) : (
            <span className="flex-1 text-sm text-gray-500">Select a country</span>
          )}
          <ChevronDownIcon className={`size-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-lg border border-border bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-border px-3.5">
              <SearchIcon className="size-4 text-gray-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setHighlight(0);
                }}
                onKeyDown={onKeyDown}
                placeholder={`Search ${countries.length} countries`}
                aria-controls={listId}
                aria-activedescendant={results[highlight] ? `${listId}-${results[highlight].code}` : undefined}
                className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
            </div>
            <ul id={listId} role="listbox" className="max-h-72 overflow-y-auto p-1.5">
              {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-gray-500">No country found</li>}
              {results.map((c, i) => {
                const selected = c.code === value?.code;
                return (
                  <li
                    key={c.code}
                    id={`${listId}-${c.code}`}
                    role="option"
                    aria-selected={selected}
                    onMouseEnter={() => setHighlight(i)}
                    onClick={() => pick(c)}
                    className={`flex cursor-pointer items-center gap-3 rounded-md px-2.5 py-2 text-sm ${
                      i === highlight ? "bg-gray-100" : ""
                    }`}
                  >
                    <span className="text-lg leading-none">{flagEmoji(c)}</span>
                    <span className={`flex-1 truncate ${selected ? "font-semibold text-black" : "text-gray-700"}`}>{c.name}</span>
                    <span className="font-mono text-xs text-gray-400">{c.dimensions.replace("x", "×")}</span>
                    {selected && <CheckIcon className="size-4 text-lime-600" />}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {POPULAR.map((code) => {
          const c = getCountry(code)!;
          const active = c.code === value?.code;
          return (
            <button
              key={code}
              type="button"
              disabled={disabled}
              onClick={() => pick(c)}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                active
                  ? "border-lime-600 bg-lime-600/10 text-lime-700"
                  : "border-border text-gray-600 hover:border-gray-300 hover:text-black"
              }`}
            >
              <span>{flagEmoji(c)}</span>
              {c.code === "EU" ? "Schengen" : c.name.replace("United Kingdom", "UK").replace("United States", "US")}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Dropzone({
  file,
  disabled,
  onFile,
  onError,
}: {
  file: File | null;
  disabled: boolean;
  onFile: (f: File | null) => void;
  onError: (message: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  // Browsers without HEIC support can't render the thumbnail; remember which URL failed
  const [failedPreview, setFailedPreview] = useState<string | null>(null);
  const previewFailed = failedPreview === preview;

  useEffect(() => () => void (preview && URL.revokeObjectURL(preview)), [preview]);

  function accept(f?: File) {
    if (!f) return;
    if (!f.type.startsWith("image/") && !/\.(heic|heif)$/i.test(f.name)) return onError("Please choose an image file.");
    if (f.size > MAX_MB * 1024 * 1024) return onError(`Photo is larger than ${MAX_MB} MB. Please choose a smaller file.`);
    onFile(f);
  }

  const picker = (
    <input
      ref={input}
      type="file"
      accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
      className="sr-only"
      disabled={disabled}
      onChange={(e) => {
        accept(e.target.files?.[0]);
        e.target.value = "";
      }}
    />
  );

  if (file) {
    return (
      <div className="flex items-center gap-4 rounded-lg border border-border bg-gray-50 p-3">
        {picker}
        <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-white">
          {preview && !previewFailed ? (
            // eslint-disable-next-line @next/next/no-img-element -- local blob preview
            <img src={preview} alt="Selected photo" className="size-full object-cover" onError={() => setFailedPreview(preview)} />
          ) : (
            <ImageIcon className="size-6 text-gray-400" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-black">{file.name}</p>
          <p className="mt-0.5 text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
          <button
            type="button"
            disabled={disabled}
            onClick={() => input.current?.click()}
            className="mt-2 text-xs font-semibold text-lime-700 underline-offset-4 hover:underline disabled:opacity-50"
          >
            Choose a different photo
          </button>
        </div>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onFile(null)}
          aria-label="Remove photo"
          className="flex size-8 shrink-0 items-center justify-center self-start rounded-md text-gray-400 transition-colors hover:bg-white hover:text-black disabled:opacity-50"
        >
          <XIcon className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        accept(e.dataTransfer.files[0]);
      }}
      className={`group relative flex cursor-pointer flex-col items-center overflow-hidden rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-lime-600/40 sm:py-12 ${
        dragging
          ? "border-lime-600 bg-lime-50"
          : "border-lime-600/40 bg-linear-to-b from-lime-50/80 to-white hover:border-lime-600 hover:from-lime-50"
      } ${disabled ? "pointer-events-none opacity-60" : ""}`}
    >
      {picker}
      <span className="relative flex size-14 items-center justify-center">
        <span
          aria-hidden
          className={`absolute inset-0 rounded-lg bg-lime-600/25 motion-safe:animate-ping ${dragging ? "" : "motion-safe:[animation-duration:2.5s]"}`}
        />
        <span className="relative flex size-14 items-center justify-center rounded-lg bg-lime-600 text-white shadow-sm transition-transform group-hover:-translate-y-0.5">
          <UploadIcon className="size-6" />
        </span>
      </span>
      <span className="mt-5 text-base font-semibold text-black sm:text-lg">
        {dragging ? "Drop it here" : "Drag your photo here"}
      </span>
      <span className="mt-1 text-sm text-gray-500">or</span>
      <span className="mt-3 inline-flex items-center gap-2 rounded-lg bg-lime-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors group-hover:bg-lime-700">
        <ImageIcon className="size-4" />
        <span className="sm:hidden">Choose or take a photo</span>
        <span className="hidden sm:inline">Choose a photo</span>
      </span>
      <span className="mt-5 flex flex-wrap items-center justify-center gap-1.5 text-xs text-gray-500">
        {["JPG", "PNG", "WebP", "HEIC"].map((f) => (
          <span key={f} className="rounded-md border border-border bg-white px-2 py-0.5 font-medium text-gray-600">
            {f}
          </span>
        ))}
        <span className="ml-1">up to {MAX_MB} MB</span>
      </span>
    </label>
  );
}

function Progress({ stage }: { stage: number }) {
  return (
    <div aria-live="polite">
      <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-lime-600 transition-[width] ease-linear"
          style={{
            width: `${((stage + 1) / (STAGES.length + 1)) * 100}%`,
            // Glide across each step instead of jumping; snap quickly to 100% at the end
            transitionDuration: `${stage === STAGES.length ? 500 : STAGE_MS}ms`,
          }}
        />
      </div>
      <ol className="mt-4 grid gap-2 sm:grid-cols-2">
        {STAGES.map((label, i) => (
          <li key={label} className={`flex items-center gap-2 text-sm ${i <= stage ? "text-black" : "text-gray-400"}`}>
            {i < stage ? (
              <CheckIcon className="size-4 text-lime-600" />
            ) : i === stage ? (
              <span className="size-4 animate-spin rounded-full border-2 border-lime-600 border-t-transparent" />
            ) : (
              <span className="size-4 rounded-full border-2 border-gray-200" />
            )}
            {label}
          </li>
        ))}
      </ol>
    </div>
  );
}
