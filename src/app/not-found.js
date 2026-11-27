import NotFoundView from "@/components/NotFoundView";

export const metadata = { title: "Page not found" }; // Next adds noindex to not-found pages automatically

export default function NotFound() {
  return (
    <main className="min-h-svh bg-charcoal text-ink">
      <NotFoundView />
    </main>
  );
}
