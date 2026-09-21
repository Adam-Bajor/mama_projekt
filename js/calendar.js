(function () {
    const dateUtils = window.TabletkiDate;

    function createElement(tagName, className, text) {
        const element = document.createElement(tagName);
        element.className = className;
        if (text) element.textContent = text;
        return element;
    }

    function cycleDayFor(date, cycleStart) {
        const difference = dateUtils.daysBetween(cycleStart, date);
        return ((difference % 28) + 28) % 28 + 1;
    }

    function takesPill(date, cycleStart) { return cycleDayFor(date, cycleStart) <= 21; }

    function renderHome(cycleStart, today) {
        const isPillDay = takesPill(today, cycleStart);
        const answer = document.getElementById("todayAnswer");
        answer.textContent = isPillDay ? "TAK" : "NIE";
        answer.classList.toggle("yes", isPillDay);
        answer.classList.toggle("no", !isPillDay);
        document.getElementById("todayCycleDay").textContent = `Dzień cyklu: ${cycleDayFor(today, cycleStart)}`;
    }

    function renderCalendar(cycleStart, visibleMonth, today) {
        const calendar = document.getElementById("calendar");
        const year = visibleMonth.getFullYear();
        const month = visibleMonth.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const mondayOffset = (new Date(year, month, 1).getDay() + 6) % 7;
        calendar.style.setProperty("--calendar-rows", Math.ceil((mondayOffset + daysInMonth) / 7));
        document.getElementById("calendarTitle").textContent = `${dateUtils.monthTitleNames[month]} ${year}`;
        document.getElementById("calendarSubtitle").textContent = "Tak = dzień tabletki. Nie = przerwa.";
        calendar.replaceChildren();
        dateUtils.weekdayNames.forEach((name) => calendar.appendChild(createElement("div", "weekday", name)));
        for (let index = 0; index < mondayOffset; index++) calendar.appendChild(createElement("div", "day is-empty"));

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const cycleDay = cycleDayFor(date, cycleStart);
            const isPillDay = takesPill(date, cycleStart);
            const isToday = date.getTime() === new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
            const tile = createElement("article", `day ${isPillDay ? "is-pill" : "is-break"} ${isToday ? "is-today" : ""}`);
            const dateLine = createElement("div", "date");
            dateLine.appendChild(createElement("span", "number", String(day)));
            dateLine.appendChild(createElement("span", "month", dateUtils.monthNames[month]));
            tile.append(dateLine, createElement("div", "status", isPillDay ? "Tak" : "Nie"), createElement("div", "cycle", `Dzień ${cycleDay}`));
            tile.setAttribute("aria-label", `${day} ${dateUtils.monthNames[month]}: tabletka ${isPillDay ? "tak" : "nie"}, dzień cyklu ${cycleDay}`);
            calendar.appendChild(tile);
        }
    }

    window.TabletkiCalendar = { renderHome, renderCalendar };
}());