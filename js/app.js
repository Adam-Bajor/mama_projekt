(function () {
    const dateUtils = window.TabletkiDate;
    const api = window.TabletkiApi;
    const calendar = window.TabletkiCalendar;
    const defaultCycleStart = new Date(2024, 6, 21);
    const today = new Date();
    let cycleStart = defaultCycleStart;
    let visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    function showScreen(screenName) {
        document.getElementById("home").classList.toggle("is-active", screenName === "home");
        document.getElementById("calendarScreen").classList.toggle("is-active", screenName === "calendar");
    }

    function render() {
        calendar.renderHome(cycleStart, today);
        calendar.renderCalendar(cycleStart, visibleMonth, today);
        document.getElementById("cycleStartInput").value = dateUtils.formatInputDate(cycleStart);
    }

    function updateCycleStart(value) {
        const parsedDate = dateUtils.parseInputDate(value);
        if (!parsedDate) return;
        cycleStart = parsedDate;
        render();
    }

    function setupDateDialog() {
        const dialog = document.getElementById("dateDialog");
        const form = document.getElementById("dateForm");
        const message = document.getElementById("dateDialogMessage");
        document.getElementById("changeDateButton").addEventListener("click", () => {
            form.reset();
            message.className = "date-dialog-message";
            message.textContent = "";
            document.getElementById("newCycleStart").value = dateUtils.formatInputDate(cycleStart);
            dialog.showModal();
        });
        document.getElementById("cancelDateButton").addEventListener("click", () => dialog.close());
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const submitButton = form.querySelector("button[type=submit]");
            submitButton.disabled = true;
            submitButton.textContent = "Ładowanie...";
            message.textContent = "";
            try {
                const savedDate = await api.saveCycleStart(document.getElementById("adminPassword").value, document.getElementById("newCycleStart").value);
                updateCycleStart(savedDate);
                message.className = "date-dialog-message is-success";
                message.textContent = "Data została pomyślnie zaktualizowana.";
            } catch (error) {
                message.className = "date-dialog-message";
                message.textContent = api.networkError(error);
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = "Zapisz";
            }
        });
    }

    document.getElementById("cycleStartInput").disabled = true;
    document.getElementById("cycleSettings").addEventListener("click", (event) => event.stopPropagation());
    document.getElementById("nextMonthButton").addEventListener("click", (event) => {
        event.stopPropagation();
        visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
        calendar.renderCalendar(cycleStart, visibleMonth, today);
    });
    document.getElementById("currentMonthButton").addEventListener("click", (event) => {
        event.stopPropagation();
        visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        calendar.renderCalendar(cycleStart, visibleMonth, today);
    });
    document.getElementById("app").addEventListener("click", () => {
        const isHomeActive = document.getElementById("home").classList.contains("is-active");
        showScreen(isHomeActive ? "calendar" : "home");
    });

    setupDateDialog();
    render();
    api.loadCycleStart().then((savedDate) => {
        if (dateUtils.parseInputDate(savedDate)) updateCycleStart(savedDate);
    }).catch((error) => console.error("Błąd pobierania daty:", error));
}());