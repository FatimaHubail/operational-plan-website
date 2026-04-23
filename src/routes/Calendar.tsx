import { useState } from "react";

const hourTrackStyle = {
  backgroundImage: "linear-gradient(to bottom, rgb(226 232 240) 1px, transparent 1px)",
  backgroundSize: "100% 48px",
  backgroundPosition: "0 0",
};

const GMT_PLUS_3_TIMEZONE = "Etc/GMT-3";

export default function Calendar() {
  const [isWeekView, setIsWeekView] = useState(true);
  const now = new Date();
  const zonedNow = new Date(now.toLocaleString("en-US", { timeZone: GMT_PLUS_3_TIMEZONE }));
  const [displayedMonth, setDisplayedMonth] = useState(
    () => new Date(zonedNow.getFullYear(), zonedNow.getMonth(), 1),
  );

  const currentDateLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: GMT_PLUS_3_TIMEZONE,
  }).format(now);

  const todayKey = new Intl.DateTimeFormat("en-CA", {
    timeZone: GMT_PLUS_3_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  const sundayDate = new Date(now);
  sundayDate.setDate(now.getDate() - now.getDay());

  const weekDays = Array.from({ length: 5 }, (_, index) => {
    const date = new Date(sundayDate);
    date.setDate(sundayDate.getDate() + index);
    const dateNumber = new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      timeZone: GMT_PLUS_3_TIMEZONE,
    }).format(date);
    const weekdayLabel = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      timeZone: GMT_PLUS_3_TIMEZONE,
    }).format(date);
    const dateKey = new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: GMT_PLUS_3_TIMEZONE,
    }).format(date);

    return {
      dateNumber,
      weekdayLabel,
      isToday: dateKey === todayKey,
    };
  });

  const monthTitle = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: GMT_PLUS_3_TIMEZONE,
  }).format(displayedMonth);

  const firstDayOfMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth(), 1);
  const monthGridStart = new Date(firstDayOfMonth);
  monthGridStart.setDate(1 - firstDayOfMonth.getDay());

  const monthDays = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(monthGridStart);
    date.setDate(monthGridStart.getDate() + index);

    return {
      key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      dayNumber: date.getDate(),
      isCurrentMonth: date.getMonth() === displayedMonth.getMonth(),
      isToday:
        date.getDate() === zonedNow.getDate() &&
        date.getMonth() === zonedNow.getMonth() &&
        date.getFullYear() === zonedNow.getFullYear(),
    };
  });

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
            title="Calendar"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5"
              />
            </svg>
          </span>
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
        <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Calendar</h1>
            <p className="mt-1 text-sm font-medium text-slate-500 sm:text-base">{currentDateLabel}</p>
          </div>
          <div className="inline-flex self-start rounded-full bg-slate-200/80 p-1 sm:self-auto" role="group" aria-label="Calendar view">
            <button
              type="button"
              onClick={() => setIsWeekView(true)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                isWeekView ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
              aria-pressed={isWeekView}
            >
              Week
            </button>
            <button
              type="button"
              onClick={() => setIsWeekView(false)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                !isWeekView ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
              aria-pressed={!isWeekView}
            >
              Month
            </button>
          </div>
        </header>

        {isWeekView ? (
          <div className="rounded-3xl bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.03)] ring-1 ring-slate-200/60 sm:p-6 lg:p-8">
            <div className="overflow-x-auto">
              <div className="min-w-[640px]">
                <div className="mb-2 grid grid-cols-[3.5rem_repeat(5,minmax(0,1fr))] gap-0 border-b border-slate-200 pb-3">
                  <div />
                  {weekDays.map((day) => (
                    <div className="text-center" key={`${day.weekdayLabel}-${day.dateNumber}`}>
                      {day.isToday ? (
                        <>
                          <p className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                            {day.dateNumber}
                          </p>
                          <p className="mt-0.5 text-sm font-semibold text-orange-600">{day.weekdayLabel}</p>
                        </>
                      ) : (
                        <>
                          <p className="text-xs font-medium text-slate-400">{day.dateNumber}</p>
                          <p className="text-sm font-semibold text-slate-700">{day.weekdayLabel}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                <div className="relative grid grid-cols-[3.5rem_repeat(5,minmax(0,1fr))] gap-0">
                  <div className="relative z-10 pr-2 text-right text-xs font-medium leading-[48px] text-slate-400">
                    <div>8:00</div>
                    <div>9:00</div>
                    <div>10:00</div>
                    <div>11:00</div>
                    <div>12:00</div>
                    <div>13:00</div>
                    <div>14:00</div>
                    <div>15:00</div>
                    <div>16:00</div>
                    <div className="text-slate-300">17:00</div>
                  </div>

                  <div className="relative col-span-5 grid grid-cols-5 border-l border-slate-200">
                    <div className="relative h-[432px] border-r border-slate-100" style={hourTrackStyle}>
                      <div
                        className="absolute left-1 right-1 rounded-lg border border-amber-200/80 bg-amber-100 px-2 py-1.5 text-[11px] font-semibold leading-tight text-amber-950 shadow-sm"
                        style={{ top: "72px", height: "48px" }}
                      >
                        Plan review checkpoint
                      </div>
                    </div>
                    <div className="relative h-[432px] border-r border-slate-100" style={hourTrackStyle}>
                      <div
                        className="absolute left-1 right-1 rounded-lg border border-orange-200/80 bg-orange-100 px-2 py-1.5 text-[11px] font-semibold leading-tight text-orange-950 shadow-sm"
                        style={{ top: "0", height: "48px" }}
                      >
                        KPI alignment session
                      </div>
                      <div
                        className="absolute left-1 right-1 rounded-lg border border-emerald-200/80 bg-emerald-100 px-2 py-1.5 text-[11px] font-semibold leading-tight text-emerald-900 shadow-sm"
                        style={{ top: "168px", height: "96px" }}
                      >
                        Department milestones
                      </div>
                      <div
                        className="absolute left-1 right-1 rounded-lg border border-sky-200/80 bg-sky-100 px-2 py-1.5 text-[11px] font-semibold leading-tight text-sky-900 shadow-sm"
                        style={{ top: "288px", height: "48px" }}
                      >
                        Executive briefing prep
                      </div>
                    </div>
                    <div className="relative h-[432px] border-r border-slate-100" style={hourTrackStyle}>
                      <div
                        className="absolute left-1 right-1 rounded-lg border border-violet-200/80 bg-violet-100 px-2 py-1.5 text-[11px] font-semibold leading-tight text-violet-900 shadow-sm"
                        style={{ top: "72px", height: "48px" }}
                      >
                        Initiative workshop
                      </div>
                      <div
                        className="absolute left-1 right-1 rounded-lg border border-sky-200/80 bg-sky-100 px-2 py-1.5 text-[11px] font-semibold leading-tight text-sky-900 shadow-sm"
                        style={{ top: "120px", height: "96px" }}
                      >
                        Q2 reporting clinic
                      </div>
                      <div
                        className="absolute left-1 right-1 rounded-lg border border-amber-200/80 bg-amber-100 px-2 py-1.5 text-[11px] font-semibold leading-tight text-amber-950 shadow-sm"
                        style={{ top: "360px", height: "48px" }}
                      >
                        Budget line check
                      </div>
                    </div>
                    <div className="relative h-[432px] border-r border-slate-100" style={hourTrackStyle}>
                      <div
                        className="absolute left-1 right-1 rounded-lg border border-emerald-200/80 bg-emerald-100 px-2 py-1.5 text-[11px] font-semibold leading-tight text-emerald-900 shadow-sm"
                        style={{ top: "24px", height: "144px" }}
                      >
                        Steering committee
                      </div>
                    </div>
                    <div className="relative h-[432px]" style={hourTrackStyle}>
                      <div className="pointer-events-none absolute left-0 right-0 z-20 flex items-center" style={{ top: "192px" }} aria-hidden="true">
                        <div className="h-0.5 w-full bg-orange-500/90" />
                        <span className="absolute -left-1 h-2 w-2 rounded-full bg-orange-500" />
                      </div>
                      <div
                        className="absolute left-1 right-1 rounded-lg border border-sky-200/80 bg-sky-100 px-2 py-1.5 text-[11px] font-semibold leading-tight text-sky-900 shadow-sm"
                        style={{ top: "24px", height: "48px" }}
                      >
                        Metrics data review
                      </div>
                      <div
                        className="absolute left-1 right-1 rounded-lg border border-orange-200/80 bg-orange-100 px-2 py-1.5 text-[11px] font-semibold leading-tight text-orange-950 shadow-sm"
                        style={{ top: "144px", height: "72px" }}
                      >
                        Planning office 1:1 · submission review
                      </div>
                      <div
                        className="absolute left-1 right-1 rounded-lg border border-amber-200/80 bg-amber-100 px-2 py-1.5 text-[11px] font-semibold leading-tight text-amber-950 shadow-sm"
                        style={{ top: "288px", height: "48px" }}
                      >
                        Strategic indicators review
                      </div>
                      <div
                        className="absolute left-1 right-1 rounded-lg border border-violet-200/80 bg-violet-100 px-2 py-1.5 text-[11px] font-semibold leading-tight text-violet-900 shadow-sm"
                        style={{ top: "336px", height: "96px" }}
                      >
                        Cross-unit actions
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.03)] ring-1 ring-slate-200/60 sm:p-6 lg:p-8">
            <div className="mb-4 flex items-center justify-between sm:mb-5">
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl">{monthTitle}</h2>
              <div className="flex gap-1">
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-gray-100"
                  aria-label="Previous month"
                  onClick={() =>
                    setDisplayedMonth(
                      (prevMonth) => new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 1, 1),
                    )
                  }
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-gray-100"
                  aria-label="Next month"
                  onClick={() =>
                    setDisplayedMonth(
                      (prevMonth) => new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 1),
                    )
                  }
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[640px] rounded-xl border border-slate-200 bg-white">
                <div className="grid grid-cols-7 border-b border-slate-200">
                  <div className="border-r border-slate-100 py-2.5 text-center text-[11px] font-semibold tracking-wide text-slate-400">SUN</div>
                  <div className="border-r border-slate-100 py-2.5 text-center text-[11px] font-semibold tracking-wide text-slate-400">MON</div>
                  <div className="border-r border-slate-100 py-2.5 text-center text-[11px] font-semibold tracking-wide text-slate-400">TUE</div>
                  <div className="border-r border-slate-100 py-2.5 text-center text-[11px] font-semibold tracking-wide text-slate-400">WED</div>
                  <div className="border-r border-slate-100 py-2.5 text-center text-[11px] font-semibold tracking-wide text-slate-400">THU</div>
                  <div className="border-r border-slate-100 py-2.5 text-center text-[11px] font-semibold tracking-wide text-slate-400">FRI</div>
                  <div className="py-2.5 text-center text-[11px] font-semibold tracking-wide text-slate-400">SAT</div>
                </div>
                {Array.from({ length: 6 }, (_, weekIndex) => {
                  const week = monthDays.slice(weekIndex * 7, weekIndex * 7 + 7);
                  const isLastRow = weekIndex === 5;
                  return (
                    <div className={`grid grid-cols-7 ${isLastRow ? "" : "border-b border-slate-200"}`} key={`week-${weekIndex}`}>
                      {week.map((day, dayIndex) => {
                        const isLastColumn = dayIndex === 6;
                        return (
                          <div
                            className={`min-h-[6.5rem] p-1.5 sm:min-h-[7.5rem] sm:p-2 ${isLastColumn ? "" : "border-r border-slate-100"}`}
                            key={day.key}
                          >
                            {day.isToday ? (
                              <p className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-center text-xs font-bold text-white">
                                {day.dayNumber}
                              </p>
                            ) : (
                              <p className={`text-center text-xs font-semibold ${day.isCurrentMonth ? "text-slate-900" : "text-slate-300"}`}>
                                {day.dayNumber}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    );
}