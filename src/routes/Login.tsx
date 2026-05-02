import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import uobLogo from "@/assets/UOB_LOGO.png"

export default function Login() {
  const year = new Date().getFullYear()

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased lg:flex-row">
      <aside
        className="relative isolate flex min-h-[220px] w-full shrink-0 flex-col justify-between overflow-hidden px-8 py-10 sm:px-10 sm:py-12 lg:min-h-screen lg:w-[60%] lg:px-12 lg:py-14"
        aria-label="Product information"
      >
        <div className="pointer-events-none absolute inset-0 bg-primary" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-24 -top-16 h-[22rem] w-[22rem] rounded-full bg-primary-foreground/15 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-primary-foreground/10 blur-3xl" aria-hidden="true" />

        <div className="relative z-10 flex flex-1 flex-col justify-center">
          <p className="inline-flex w-fit items-center rounded-full bg-primary-foreground/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-primary-foreground ring-1 ring-primary-foreground/20">
            Operational Plan
          </p>
          <h1 className="mt-6 max-w-md text-3xl font-bold leading-tight tracking-tight text-primary-foreground sm:text-4xl">
            Operational planning across university administration
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-primary-foreground/80">
            Internal workspace for University of Bahrain staff responsible for strategic operational plans.
          </p>
        </div>

        <p className="relative z-10 mt-10 text-xs leading-relaxed text-primary-foreground/60 lg:mt-0">
          {`© ${year} University of Bahrain · Internal use only`}
        </p>
      </aside>

      <main className="relative flex w-full min-w-0 flex-col items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:w-[40%] lg:px-7 lg:py-16">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-muted via-background to-muted" aria-hidden="true" />
        <div className="relative z-10 w-full max-w-[500px] lg:max-w-none">
          <div className="rounded-3xl bg-card p-8 shadow-sm ring-1 ring-border/60 sm:p-10 lg:p-10">
            <div className="mb-9 text-center">
              <img
                src={uobLogo}
                alt="University of Bahrain logo"
                className="mx-auto mb-5 h-[128px] w-[128px] object-contain lg:h-[136px] lg:w-[136px]"
              />
              <h2 className="text-xl font-bold tracking-tight text-foreground lg:text-2xl">Login</h2>
              <p className="mt-1 text-sm text-muted-foreground lg:text-[0.9375rem]">
                Use your University of Bahrain email and password
              </p>
            </div>

            <form className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="uni-email" className="text-sm font-medium text-foreground">
                  University email
                </label>
                <Input
                  type="email"
                  id="uni-email"
                  name="email"
                  autoComplete="username"
                  placeholder="name@uob.edu.bh"
                  required
                  className="h-11 rounded-2xl bg-muted"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  required
                  className="h-11 rounded-2xl bg-muted"
                />
              </div>

              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
                  <Checkbox name="remember" />
                  Remember this device
                </label>
                <Link
                  to="#"
                  className="text-sm font-semibold text-primary transition hover:text-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="mt-2 h-11 w-full rounded-2xl">
                Sign in
              </Button>
            </form>

            <p className="mt-6 border-t border-border pt-6 text-center text-xs leading-relaxed text-muted-foreground">
              Trouble signing in? Contact{" "}
              <Link to="#" className="font-semibold text-primary hover:text-primary/90">
                IT support
              </Link>{" "}
              or your planning office.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary">Planning</Badge>
              <Badge className="bg-muted text-foreground hover:bg-muted">Strategy</Badge>
              <Badge className="bg-accent text-accent-foreground hover:bg-accent">Operations</Badge>
              <Badge className="border border-border bg-card text-foreground hover:bg-muted">Auditor review</Badge>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
