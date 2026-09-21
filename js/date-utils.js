(function () {
    const monthNames = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];
    const monthTitleNames = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
    const weekdayNames = ["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"];

    function formatInputDate(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    }

    function parseInputDate(value) {
        if (!value) return null;
        const [year, month, day] = value.split("-").map(Number);
        const date = new Date(year, month - 1, day);
        return Number.isNaN(date.getTime()) ? null : date;
    }

    function daysBetween(fromDate, toDate) {
        const start = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
        const end = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
        return Math.floor((end - start) / (24 * 60 * 60 * 1000));
    }

    window.TabletkiDate = {
        formatInputDate,
        parseInputDate,
        daysBetween,
        monthNames,
        monthTitleNames,
        weekdayNames
    };
}());