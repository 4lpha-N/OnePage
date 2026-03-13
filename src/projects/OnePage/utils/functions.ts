import type { ComponentType } from 'react';
import { useEffect, useRef } from 'react';

export interface CookieType {
  theme: 'light' | 'dark';
  overviewMode: boolean;
  keyboardEnabled: boolean;
  navEnabled: boolean;
}

// ──────────────────────────────────────────────────────────────
// PageDef – wird von OnePage und den Hooks gemeinsam genutzt
// ──────────────────────────────────────────────────────────────
export interface PageDef {
  id: number;
  row: number;
  col: number;
  component: ComponentType;
  bg?: string;
}

// Setzt ein Cookie mit einem Objekt als Wert
export function setCookieObject(name: string, value: CookieType, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const stringified = encodeURIComponent(JSON.stringify(value));
  document.cookie = `${name}=${stringified}; expires=${expires}; path=/`;
}

// Liest ein Cookie und gibt das Objekt zurück
export function getCookieObject(name: string): CookieType | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) {
    try {
      return JSON.parse(decodeURIComponent(match[2]));
    } catch {
      return null;
    }
  }
  return null;
}

// ──────────────────────────────────────────────────────────────
// Pfeiltasten → Navigations-Delta
// ──────────────────────────────────────────────────────────────
const ARROW_DELTA: Record<string, { dr: number; dc: number }> = {
  ArrowUp:    { dr: -1, dc:  0 },
  ArrowDown:  { dr:  1, dc:  0 },
  ArrowLeft:  { dr:  0, dc: -1 },
  ArrowRight: { dr:  0, dc:  1 },
};

// ──────────────────────────────────────────────────────────────
// useArrowKeyNavigation
//
// Registriert keydown / keyup-Handler auf window.
// Navigation wird erst beim ersten keyup ausgelöst, sodass
// z. B. ← + ↑ als diagonale Bewegung gezählt wird.
// Während der Slide-Animation (transitionMs) ist Navigation gesperrt.
//
// @param navigate      Callback der tatsächlichen Navigation (dr, dc)
// @param enabled       Aktiviert / deaktiviert den Hook komplett
// @param transitionMs  Sperrzeit nach einer Navigation in ms (default 600)
// ──────────────────────────────────────────────────────────────
export function useArrowKeyNavigation(
  navigate: (dr: number, dc: number) => void,
  enabled: boolean,
  transitionMs = 300,
): void {
  // Stabile Referenz auf den aktuellen navigate-Callback
  const navigateRef = useRef(navigate);
  useEffect(() => { navigateRef.current = navigate; }, [navigate]);

  // Aktuell gedrückte Pfeiltasten
  const pressedKeys = useRef<Set<string>>(new Set());

  // Buffer: true solange die Slide-Animation läuft
  const navigating = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!(e.key in ARROW_DELTA)) return;
      e.preventDefault(); // Browser-Scroll verhindern
      pressedKeys.current.add(e.key);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!(e.key in ARROW_DELTA)) return;
      e.preventDefault();

      if (navigating.current) {
        // Während der Animation alle gehaltenen Tasten verwerfen
        pressedKeys.current.clear();
        return;
      }

      // Delta aus allen aktuell gehaltenen Pfeiltasten kombinieren
      let dr = 0;
      let dc = 0;
      for (const key of pressedKeys.current) {
        dr += ARROW_DELTA[key].dr;
        dc += ARROW_DELTA[key].dc;
      }
      // Set leeren – weitere keyup-Events derselben Combo lösen nichts aus
      pressedKeys.current.clear();

      if (dr !== 0 || dc !== 0) {
        navigating.current = true;
        navigateRef.current(Math.sign(dr), Math.sign(dc));
        setTimeout(() => { navigating.current = false; }, transitionMs);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    const keys = pressedKeys.current;
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      keys.clear();
    };
  }, [enabled, transitionMs]);
}

// ──────────────────────────────────────────────────────────────
// useOverviewKeyNavigation
//
// Keyboard-Navigation im Overview-Modus:
//   Pfeiltasten     → benachbarte Seite fokussieren
//   Tab / Shift+Tab → zyklisch durch alle Seiten (Lesereihenfolge)
//   Enter / Space   → fokussierte Seite bestätigen (wie Klick)
//
// @param enabled      Aktiv solange der Overview-Modus offen ist
// @param setFocused   State-Setter für die fokussierte Seite
// @param sortedPages  Alle Seiten in Lesereihenfolge (für Tab)
// @param pageMap      Map "row,col" → PageDef (für Pfeiltasten)
// @param onConfirm    Wird mit der fokussierten Seite aufgerufen
// ──────────────────────────────────────────────────────────────
export function useOverviewKeyNavigation(
  enabled: boolean,
  setFocused: (updater: (prev: PageDef) => PageDef) => void,
  sortedPages: PageDef[],
  pageMap: Map<string, PageDef>,
  onConfirm: (page: PageDef) => void,
): void {
  const onConfirmRef = useRef(onConfirm);
  useEffect(() => { onConfirmRef.current = onConfirm; }, [onConfirm]);

  const setFocusedRef = useRef(setFocused);
  useEffect(() => { setFocusedRef.current = setFocused; }, [setFocused]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        setFocusedRef.current(prev => {
          const idx = sortedPages.findIndex(p => p.id === prev.id);
          return e.shiftKey
            ? sortedPages[(idx - 1 + sortedPages.length) % sortedPages.length]
            : sortedPages[(idx + 1) % sortedPages.length];
        });
        return;
      }

      if (e.key in ARROW_DELTA) {
        e.preventDefault();
        const { dr, dc } = ARROW_DELTA[e.key];
        setFocusedRef.current(prev => {
          const target = pageMap.get(`${prev.row + dr},${prev.col + dc}`);
          return target ?? prev;
        });
        return;
      }

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setFocusedRef.current(prev => {
          onConfirmRef.current(prev);
          return prev;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, sortedPages, pageMap]);
}
