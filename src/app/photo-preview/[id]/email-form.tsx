"use client";

import { useActionState } from "react";
import { AlertIcon, CheckIcon, MailIcon } from "@/components/ui/icons";
import { sendPhoto, type SendState } from "./actions";

export function EmailForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState(sendPhoto.bind(null, id), { status: "idle" } as SendState);

  if (state.status === "sent") {
    return (
      <div className="rounded-lg border border-lime-600/30 bg-lime-600/5 p-5" role="status">
        <p className="flex items-center gap-2 text-sm font-semibold text-black">
          <CheckIcon className="size-4 text-lime-600" />
          Photo sent to {state.email}
        </p>
        <p className="mt-1.5 text-sm leading-6 text-gray-600">
          It should arrive within a minute. If you can&apos;t find it, check your spam folder.
        </p>
      </div>
    );
  }

  return (
    <form action={action}>
      <label htmlFor="email" className="text-sm font-medium text-black">
        Email address
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <MailIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-gray-400" />
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={state.email}
            placeholder="you@example.com"
            aria-invalid={state.status === "error"}
            className="h-12 w-full rounded-lg border border-gray-300 bg-white pr-3.5 pl-10 text-sm outline-none transition-colors placeholder:text-gray-400 hover:border-gray-400 focus:border-lime-600 focus:ring-2 focus:ring-lime-600/15"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-lime-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-lime-700 disabled:opacity-70"
        >
          {pending && <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
          {pending ? "Sending…" : "Send my photo"}
        </button>
      </div>
      {state.status === "error" && (
        <p role="alert" className="mt-2.5 flex items-start gap-2 text-sm text-red-700">
          <AlertIcon className="mt-0.5 size-4" />
          {state.message}
        </p>
      )}
      <p className="mt-3 text-xs text-gray-500">We only use your email to send this photo. No newsletters.</p>
    </form>
  );
}
