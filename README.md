# Tabletki - konfiguracja zapisu daty

Strona nie zapisuje daty w cookies, `localStorage` ani `sessionStorage`. Odczyt i zapis przechodza przez funkcje Supabase, wiec wyczyszczenie danych przegladarki nie usuwa daty.

## 1. Utworzenie bazy Supabase

1. Wejdz na https://supabase.com i utworz projekt na darmowym planie.
2. Otworz **SQL Editor**, wklej zawartosc pliku `supabase/schema.sql` i uruchom zapytanie.
3. W **Project Settings > Edge Functions > Secrets** dodaj sekret:
   - nazwa: `TABLETKI_ADMIN_PASSWORD`
   - wartosc: haslo administracyjne, np. `zaq1@WSX`

Haslo wpisuje sie tylko jako sekret funkcji. Nie wpisuj go do `TABELTKI.html`, `config.js` ani do publicznego repozytorium.

## 2. Publikacja funkcji

Zainstaluj Supabase CLI, zaloguj sie i polacz katalog z projektem. Polecenia uruchom w katalogu zawierajacym ten plik:

```text
supabase login
supabase link --project-ref TWOJ_PROJECT_REF
supabase functions deploy cycle-date --no-verify-jwt
```

Opcja `--no-verify-jwt` jest potrzebna, bo zwykly odczyt strony jest publiczny. Sama zmiana daty jest chroniona haslem sprawdzanym wewnatrz funkcji.

Po wdrozeniu adres funkcji ma postac:

```text
https://TWOJ_PROJECT_REF.supabase.co/functions/v1/cycle-date
```

Wpisz ten adres w `config.js`, zastepujac wartosc `TWOJ-PROJEKT`.

## 3. GitHub Pages

1. Utworz repozytorium na GitHubie.
2. Umiesc w nim `TABELTKI.html`, `config.js` oraz pozostale pliki strony. Zmien nazwe `TABELTKI.html` na `index.html` albo ustaw ten plik jako strone startowa wedlug konfiguracji projektu.
3. W repozytorium wybierz **Settings > Pages**.
4. Jako zrodlo wybierz **Deploy from a branch**, wskaz branch (np. `main`) i katalog `/ (root)`.
5. Otworz wygenerowany adres GitHub Pages.

## 4. Sprawdzenie

Po otwarciu strona pobiera date z Supabase. Pole daty jest tylko do odczytu. Przycisk **Zmien date** otwiera formularz, ale zapis przejdzie tylko po poprawnym sekrecie backendu.

Aby sprawdzic trwalosc: zapisz date, zamknij strone, wyczysc cookies i dane witryny dla domeny GitHub Pages, a potem otworz ja ponownie. Data nadal zostanie pobrana z Supabase, bo nie jest przechowywana w przegladarce.