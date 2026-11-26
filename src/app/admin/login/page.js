import { Suspense } from "react";
import LoginForm from "@/components/admin/LoginForm";

export const metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <div className="grid min-h-svh place-items-center bg-charcoal px-5">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
