export default function Notifications() {
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-slate-900 antialiased">
      <aside className="flex w-[72px] shrink-0 flex-col items-center bg-[#1a1f36] py-6 sm:w-20" aria-label="Main navigation">
        <nav className="flex flex-1 flex-col items-center gap-3">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-slate-400 transition hover:bg-white/10 hover:text-white"
            title="Home"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </button>
          <span
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/30"
            aria-current="page"
            title="Notifications"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              />
            </svg>
          </span>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-slate-400 transition hover:bg-white/10 hover:text-white"
            title="Calendar"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5"
              />
            </svg>
          </button>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-slate-400 transition hover:bg-white/10 hover:text-white"
            title="Projects"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9 9 0 100-18 9 9 0 000 18zM12 3v4m0 10v4M3 12h4m10 0h4M5.6 5.6l2.8 2.8m7.2 7.2l2.8 2.8M5.6 18.4l2.8-2.8m7.2-7.2l2.8-2.8"
              />
            </svg>
          </button>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-slate-400 transition hover:bg-white/10 hover:text-white"
            title="Analytics"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
              />
            </svg>
          </button>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-slate-400 transition hover:bg-white/10 hover:text-white"
            title="Auditor workspace"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664v.75h-4.5M4.5 15.75v-2.25m0 0h15m-15 0H3m9.75 0H9m9.75 0H15"
              />
            </svg>
          </button>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-slate-400 transition hover:bg-white/10 hover:text-white"
            title="My submissions"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18.75h3.75m4.5-13.5V9M15 9v.75M15 12.75h3.75M15 15h3.75M15 17.25H9M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
              />
            </svg>
          </button>
          <button
            type="button"
            className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl text-slate-400 transition hover:bg-white/10 hover:text-white"
            title="Add"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </nav>
        <div className="mt-auto flex flex-col items-center gap-3 border-t border-white/10 pt-6">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-slate-400 transition hover:bg-white/10 hover:text-white"
            title="Settings"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.37.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-slate-400 transition hover:bg-white/10 hover:text-white"
            title="Log out"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
        <header className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">University administration</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Notifications</h1>
            <p className="mt-1 max-w-xl text-sm text-slate-600">
              Updates on plans, milestones, submissions, and tasks - including auditor decisions (accept, request changes,
              resubmission pending). Open{" "}
              <span className="font-semibold text-orange-600 hover:text-orange-700">My submissions</span> for a full request list.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="text-sm font-semibold text-orange-600 transition hover:text-orange-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/40 focus-visible:ring-offset-2"
            >
              Mark all as read
            </button>
          </div>
        </header>

        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex rounded-full bg-slate-200/80 p-1" role="tablist" aria-label="Filter notifications">
            <button type="button" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm" aria-selected="true">
              All
            </button>
            <button type="button" className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900" aria-selected="false">
              Unread
            </button>
            <button type="button" className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900" aria-selected="false">
              Planning
            </button>
          </div>
          <div className="relative w-full max-w-md sm:max-w-sm">
            <input
              type="search"
              placeholder="Search notifications"
              className="w-full rounded-full border-0 bg-white py-2.5 pl-4 pr-10 text-sm text-slate-700 shadow-[0_8px_30px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.03)] outline-none ring-1 ring-slate-200/80 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-400/30"
              aria-label="Search notifications"
            />
            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </span>
          </div>
        </div>

        <section className="rounded-3xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.03)] ring-1 ring-slate-200/60" aria-labelledby="notif-list-heading">
          <h2 id="notif-list-heading" className="sr-only">
            Notification list
          </h2>

          <div className="border-b border-slate-100 px-5 py-3 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Today</p>
          </div>
          <ul className="divide-y divide-slate-100">
            <li>
              <button type="button" className="flex w-full gap-4 px-5 py-4 text-left transition hover:bg-slate-50/80 sm:px-6 sm:py-5">
                <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                  <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-orange-500 ring-2 ring-white" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-900">Operational plan review requested</span>
                    <span className="shrink-0 text-xs font-medium text-slate-400">2 min ago</span>
                  </span>
                  <span className="mt-0.5 block text-sm text-slate-600">
                    Provost office asked for Q2 milestone updates in the consolidated plan.
                  </span>
                  <span className="mt-2 inline-flex text-xs font-semibold text-orange-600">Planning</span>
                </span>
              </button>
            </li>
            <li>
              <button type="button" className="flex w-full gap-4 px-5 py-4 text-left transition hover:bg-slate-50/80 sm:px-6 sm:py-5">
                <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-800">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.42 15.17L17.25 9.34M12.75 15.75l.75.75m-1.5-3l-.75-.75m-1.5 3.75h9.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                    />
                  </svg>
                  <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-orange-500 ring-2 ring-white" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-900">Auditor requested changes</span>
                    <span className="shrink-0 text-xs font-medium text-slate-400">25 min ago</span>
                  </span>
                  <span className="mt-0.5 block text-sm text-slate-600">
                    REQ-2026-0112 (KPI mapping workshop): field notes are available - update in Add action and resubmit.
                  </span>
                  <span className="mt-2 inline-flex text-xs font-semibold text-amber-800">Inspection</span>
                </span>
              </button>
            </li>
            <li>
              <button type="button" className="flex w-full gap-4 px-5 py-4 text-left transition hover:bg-slate-50/80 sm:px-6 sm:py-5">
                <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-800">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                  <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-orange-500 ring-2 ring-white" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-900">Resubmission in auditor queue</span>
                    <span className="shrink-0 text-xs font-medium text-slate-400">40 min ago</span>
                  </span>
                  <span className="mt-0.5 block text-sm text-slate-600">
                    Objective REQ-2026-0130 was edited and is awaiting re-review (edited - awaiting re-review).
                  </span>
                  <span className="mt-2 inline-flex text-xs font-semibold text-sky-800">Inspection</span>
                </span>
              </button>
            </li>
            <li>
              <button type="button" className="flex w-full gap-4 px-5 py-4 text-left transition hover:bg-slate-50/80 sm:px-6 sm:py-5">
                <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-orange-500 ring-2 ring-white" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-900">Objective submission accepted</span>
                    <span className="shrink-0 text-xs font-medium text-slate-400">1 hour ago</span>
                  </span>
                  <span className="mt-0.5 block text-sm text-slate-600">
                    Cross-unit reporting dashboard (REQ-2026-0098) - auditor accepted the submission.
                  </span>
                  <span className="mt-2 inline-flex text-xs font-semibold text-emerald-700">Accepted</span>
                </span>
              </button>
            </li>
            <li>
              <button type="button" className="flex w-full gap-4 px-5 py-4 text-left transition hover:bg-slate-50/80 sm:px-6 sm:py-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                    />
                  </svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-900">Reminder: budget alignment</span>
                    <span className="shrink-0 text-xs font-medium text-slate-400">9:00 am</span>
                  </span>
                  <span className="mt-0.5 block text-sm text-slate-600">
                    Link financial targets to initiatives before Friday&apos;s steering meeting.
                  </span>
                  <span className="mt-2 inline-flex text-xs font-semibold text-slate-500">Reminder</span>
                </span>
              </button>
            </li>
          </ul>

          <div className="border-b border-t border-slate-100 px-5 py-3 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Earlier</p>
          </div>
          <ul className="divide-y divide-slate-100">
            <li>
              <button type="button" className="flex w-full gap-4 px-5 py-4 text-left opacity-90 transition hover:bg-slate-50/80 sm:px-6 sm:py-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                    />
                  </svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-800">New comment on "Strategic initiatives"</span>
                    <span className="shrink-0 text-xs font-medium text-slate-400">Yesterday</span>
                  </span>
                  <span className="mt-0.5 block text-sm text-slate-600">Dr. Hayes noted a dependency on IT for KPI-04 reporting.</span>
                  <span className="mt-2 inline-flex text-xs font-semibold text-orange-600">Collaboration</span>
                </span>
              </button>
            </li>
            <li>
              <button type="button" className="flex w-full gap-4 px-5 py-4 text-left opacity-90 transition hover:bg-slate-50/80 sm:px-6 sm:py-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-800">Indicator data export ready</span>
                    <span className="shrink-0 text-xs font-medium text-slate-400">Mar 26</span>
                  </span>
                  <span className="mt-0.5 block text-sm text-slate-600">
                    Your CSV export for C1.2 (completion by year) is available for download.
                  </span>
                  <span className="mt-2 inline-flex text-xs font-semibold text-slate-500">Reporting</span>
                </span>
              </button>
            </li>
            <li>
              <button type="button" className="flex w-full gap-4 px-5 py-4 text-left opacity-90 transition hover:bg-slate-50/80 sm:px-6 sm:py-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375v3.75m0-3.75h-3.75m3.75 0h3.75" />
                  </svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-800">Role access updated</span>
                    <span className="shrink-0 text-xs font-medium text-slate-400">Mar 24</span>
                  </span>
                  <span className="mt-0.5 block text-sm text-slate-600">
                    You can now edit faculty plans for the School of Engineering.
                  </span>
                  <span className="mt-2 inline-flex text-xs font-semibold text-slate-500">Access</span>
                </span>
              </button>
            </li>
          </ul>

          <div className="border-t border-slate-100 px-5 py-4 text-center sm:px-6">
            <button
              type="button"
              className="text-sm font-semibold text-orange-600 transition hover:text-orange-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/40 focus-visible:ring-offset-2"
            >
              Load more
            </button>
          </div>
        </section>

        <p className="mt-8 text-center text-xs text-slate-500">Internal use only - Operational Plan workspace</p>
      </div>
    </div>
  )
}