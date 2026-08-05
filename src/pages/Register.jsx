import { useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function Register() {
  useEffect(() => {
    const returnUrl = `${window.location.origin}/`;
    base44.auth.redirectToLogin(returnUrl);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
        <p className="text-sm text-muted-foreground">
          Redirecting to secure registration…
        </p>
      </div>
    </div>
  );
}