(function () {
    const apiUrl = window.TABLETKI_CONFIG && window.TABLETKI_CONFIG.apiUrl;

    async function readResponse(response, fallbackMessage) {
        const text = await response.text();
        let data = {};
        try { data = text ? JSON.parse(text) : {}; } catch (error) { data = {}; }
        if (!response.ok) throw new Error(data.error || data.message || `${fallbackMessage} (HTTP ${response.status}).`);
        return data;
    }

    function networkError(error) {
        if (error instanceof TypeError && error.message === "Failed to fetch") {
            return "Nie udało się połączyć z serwerem. Sprawdź połączenie oraz konfigurację CORS funkcji Supabase.";
        }
        return error.message || "Wystąpił nieoczekiwany błąd połączenia.";
    }

    async function loadCycleStart() {
        if (!apiUrl) return null;
        const response = await fetch(apiUrl, { method: "GET" });
        const data = await readResponse(response, "Nie udało się pobrać daty");
        return data.saved_date || null;
    }

    async function saveCycleStart(password, date) {
        if (!apiUrl) throw new Error("Brak konfiguracji połączenia z serwerem.");
        let response;
        try {
            response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password, date })
            });
        } catch (error) { throw new Error(networkError(error)); }
        try {
            const data = await readResponse(response, "Nie udało się zapisać daty");
            const savedDate = data.saved_date;
            if (data.success !== true || !savedDate) throw new Error("Serwer nie potwierdził zapisania daty.");
            return savedDate;
        } catch (error) { throw new Error(networkError(error)); }
    }

    window.TabletkiApi = { loadCycleStart, saveCycleStart, networkError };
}());