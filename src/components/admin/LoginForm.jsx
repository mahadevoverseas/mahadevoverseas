"use client";

import { useActionState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Loader2, LockKeyhole } from "lucide-react";
import { login } from "@/app/admin/actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  const next = useSearchParams().get("next") ?? "";

  return (
    <form action={action} className="card w-full max-w-sm p-8">
      <Image src="/brand/logo-on-dark.png" alt="Mahadev Overseas" width={1417} height={832} priority className="mx-auto h-20 w-auto" />
      <h1 className="font-display mt-6 text-center text-3xl text-ink">Admin panel</h1>
      <p className="mt-1 text-center text-sm text-muted">Edit every page of the website.</p>
      <input type="hidden" name="next" value={next} />
      <label htmlFor="pw" className="mt-8 block text-xs font-bold tracking-[0.2em] text-muted uppercase">
        Password
      </label>
      <div className="relative mt-2">
        <LockKeyhole className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input id="pw" name="password" type="password" required autoFocus autoComplete="current-password" className="field pl-10" />
      </div>
      {state?.error && (
        <p role="alert" className="mt-3 text-sm font-semibold text-brand-red">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn btn-red mt-6 w-full disabled:opacity-60">
        {pending && <Loader2 className="size-4 animate-spin" />} Log in
      </button>
    </form>
  );
}
