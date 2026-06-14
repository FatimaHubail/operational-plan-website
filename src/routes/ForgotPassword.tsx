import { Link, useNavigate } from "react-router-dom"
import { ForgotPasswordForm } from "@/components/forgot-password-form"
import { Button } from "@/components/ui/button"
import uobLogo from "@/assets/UOB_LOGO.png"

export default function ForgotPassword() {
  const navigate = useNavigate()

  function handleSuccess() {
    navigate("/login", {
      replace: true,
      state: {
        passwordUpdated: "Password updated. Sign in with your new password.",
      },
    })
  }

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 text-foreground antialiased">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 -top-16 h-[22rem] w-[22rem] rounded-full bg-primary-foreground/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-primary-foreground/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl bg-card p-7 shadow-sm ring-1 ring-border/60 sm:p-8">
          <div className="mb-7 text-center">
            <img
              src={uobLogo}
              alt="University of Bahrain logo"
              className="mx-auto mb-4 h-24 w-24 object-contain sm:h-28 sm:w-28"
            />
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Forgot password
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Enter your university email, then choose a new password.
            </p>
          </div>

          <ForgotPasswordForm onSuccess={handleSuccess} />

          <p className="mt-7 text-center">
            <Button
              variant="link"
              className="h-auto p-0 text-sm font-semibold"
              render={<Link to="/login" />}
            >
              Back to sign in
            </Button>
          </p>
        </div>
      </div>
    </div>
  )
}
