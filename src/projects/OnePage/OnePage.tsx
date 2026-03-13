import React, { useState, useCallback, useEffect } from 'react';
import './OnePage.scss';
import { useArrowKeyNavigation, useOverviewKeyNavigation, setCookieObject, getCookieObject } from './utils/functions';
import type { PageDef } from './utils/functions';
import Header from './components/Header/Header';
import { GoArrowUpLeft, GoArrowUp, GoArrowUpRight, GoArrowLeft, GoArrowRight, GoArrowDownLeft, GoArrowDown, GoArrowDownRight } from 'react-icons/go';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Grid, Typography } from '@mui/material';

// Default Breakpoints: xs=0, sm=600, md=900, lg=1200, xl=1536
const muiTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    primary: {
      main: '#b71c1c',
    },
    secondary: {
      main: '#b71c1c',
    },
  },
});
// ──────────────────────────────────────────────
// Seitenraster (Zeile / Spalte, 0-basiert):
//
//  Seite 2 (0,0) │ Seite 3 (0,1) │ Seite 4 (0,2)
//  ───────────────┼───────────────┼───────────────
//  Seite 5 (1,0) │ Seite 1 (1,1) │ Seite 6 (1,2)
//  ───────────────┼───────────────┼───────────────
//  Seite 7 (2,0) │ Seite 8 (2,1) │ Seite 9 (2,2)
// ──────────────────────────────────────────────

function HomeContent() {
  return (
    <div>
      <Grid container spacing={4}>
          <Grid size={{ xs: 12}} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <Typography variant="h4">1 - Home</Typography>
          </Grid>
      </Grid>
      <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }} display={'block'}>
              <span>Col 1</span>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }} offset={{ xs: 0, md: 2, lg: 3, xl: 4 }}>
              <span>Col 2</span>
            </Grid>
        </Grid>
    </div>
  );
}

function DefaultContent({ label }: { label: string }) {
  return (
    <div>
      <Grid container spacing={4}>
          <Grid size={{ xs: 12}} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <Typography variant="h4">{label}</Typography>
          </Grid>
      </Grid>
    </div>
  );
}

const PAGES: PageDef[] = [
  { id: 1, row: 1, col: 1, bg: '#e8f4f8', component: HomeContent },
  { id: 2, row: 0, col: 0, bg: '#fce4ec', component: () => <DefaultContent label="2" /> },
  { id: 3, row: 0, col: 1, bg: '#f3e5f5', component: () => <DefaultContent label="3" /> },
  { id: 4, row: 0, col: 2, bg: '#e8eaf6', component: () => <DefaultContent label="4" /> },
  { id: 5, row: 1, col: 0, bg: '#e0f2f1', component: () => <DefaultContent label="5" /> },
  { id: 6, row: 1, col: 2, bg: '#fff8e1', component: () => <DefaultContent label="6" /> },
  { id: 7, row: 2, col: 0, bg: '#fbe9e7', component: () => <DefaultContent label="7" /> },
  { id: 8, row: 2, col: 1, bg: '#f1f8e9', component: () => <DefaultContent label="8" /> },
  { id: 9, row: 2, col: 2, bg: '#e3f2fd', component: () => <DefaultContent label="9" /> },
];

// Schnelle Positionssuche: "row,col" → PageDef
const PAGE_MAP = new Map<string, PageDef>(PAGES.map(p => [`${p.row},${p.col}`, p]));

// Seiten in Lesereihenfolge (für Tab-Navigation im Overview)
const SORTED_PAGES = [...PAGES].sort((a, b) =>
  a.row !== b.row ? a.row - b.row : a.col - b.col,
);

// ──────────────────────────────────────────────
// Richtungen mit CSS-Grid-Area-Namen
// ──────────────────────────────────────────────
interface Direction {
  dr: number;
  dc: number;
  symbol: string | React.ReactNode;
  area: string;
  label: string;
}

const DIRECTIONS: Direction[] = [
  { dr: -1, dc: -1, symbol: <GoArrowUpLeft />, area: 'tl', label: 'Oben Links'   },
  { dr: -1, dc:  0, symbol: <GoArrowUp />, area: 'tc', label: 'Oben'         },
  { dr: -1, dc:  1, symbol: <GoArrowUpRight />, area: 'tr', label: 'Oben Rechts'  },
  { dr:  0, dc: -1, symbol: <GoArrowLeft />, area: 'ml', label: 'Links'        },
  { dr:  0, dc:  1, symbol: <GoArrowRight />, area: 'mr', label: 'Rechts'       },
  { dr:  1, dc: -1, symbol: <GoArrowDownLeft />, area: 'bl', label: 'Unten Links'  },
  { dr:  1, dc:  0, symbol: <GoArrowDown />, area: 'bc', label: 'Unten'        },
  { dr:  1, dc:  1, symbol: <GoArrowDownRight />, area: 'br', label: 'Unten Rechts' },
];

// ──────────────────────────────────────────────
// Komponente
// ──────────────────────────────────────────────
export default function OnePage() {
  const cookie = getCookieObject('4lpha_onepage_states');
  const [current, setCurrent] = useState<PageDef>(() => PAGE_MAP.get('1,1')!);
  const [theme, setTheme] = useState<'light' | 'dark'>(cookie?.theme ?? 'light');
  const [overviewMode, setOverviewMode] = useState(cookie?.overviewMode ?? false);
  const [keyboardEnabled, setKeyboardEnabled] = useState(cookie?.keyboardEnabled ?? false);
  const [navEnabled, setNavEnabled] = useState(cookie?.navEnabled ?? false);
  const [focusedPage, setFocusedPage] = useState<PageDef>(() => PAGE_MAP.get('1,1')!);

  // Fokus auf aktuelle Seite setzen, wenn Overview geöffnet wird
  useEffect(() => {
    if (overviewMode) setFocusedPage(current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overviewMode]);

  // Keyboard-Navigation im Overview-Modus
  useOverviewKeyNavigation(
    overviewMode,
    setFocusedPage,
    SORTED_PAGES,
    PAGE_MAP,
    (page) => { setCurrent(page); setOverviewMode(false); },
  );

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }

  // States ins Cookie schreiben
  useEffect(() => {
    setCookieObject('4lpha_onepage_states', {
      theme,
      overviewMode,
      keyboardEnabled,
      navEnabled,
    });
  }, [theme, overviewMode, keyboardEnabled, navEnabled]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const navigate = useCallback(
    (dr: number, dc: number) => {
      const target = PAGE_MAP.get(`${current.row + dr},${current.col + dc}`);
      if (target) setCurrent(target);
    },
    [current],
  );

  // Verhindert Scrollbars auf body/html solange OnePage gemountet ist
  useEffect(() => {
    document.body.classList.add('mounted');
    return () => { document.body.classList.remove('mounted'); };
  }, []);

  // Tastatur nur wenn Overview geschlossen
  useArrowKeyNavigation(navigate, keyboardEnabled && !overviewMode);

  const tx = -current.col * 100;
  const ty = -current.row * 100;

  const gridStyle = overviewMode
    ? { transform: 'scale(0.3333)' }
    : { transform: `translate(${tx}vw, ${ty}vh)` };

  const handlePageClick = (page: PageDef) => {
    setCurrent(page);
    setOverviewMode(false);
  };

  return (
    <ThemeProvider theme={muiTheme}>
    <div className={`onepage-wrapper${overviewMode ? ' onepage-wrapper--overview' : ''}`}>
      {/* ── Navigations-Overlay ──────────────── */}
      {navEnabled && (
        <nav className="onepage-nav" aria-label="Seitennavigation">
          {DIRECTIONS.map(dir => {
            const exists = PAGE_MAP.has(
              `${current.row + dir.dr},${current.col + dir.dc}`,
            );
            if (!exists) return null;

            return (
              <button
                key={dir.area}
                className={`onepage-nav-btn onepage-nav-btn--${dir.area}`}
                onClick={() => navigate(dir.dr, dir.dc)}
                aria-label={dir.label}
                title={dir.label}
              >
                {dir.symbol}
              </button>
            );
          })}
        </nav>
      )}
      {/* ── Header ─────────────────────── */}
      <Header
        classes={navEnabled ? '' : 'no-nav'}
        theme={theme}
        overviewMode={overviewMode}
        keyboardEnabled={keyboardEnabled}
        navEnabled={navEnabled}
        onToggleOverview={() => setOverviewMode(v => !v)}
        onToggleKeyboard={() => setKeyboardEnabled(v => !v)}
        onToggleNav={() => setNavEnabled(v => !v)}
        onToggleTheme={toggleTheme}
      />
      {/* ── Seitenraster ─────────────────────── */}
      <div
        className="onepage-grid"
        style={gridStyle}
      >
        {PAGES.map(page => (
          <div
            key={page.id}
            className={`onepage-page${overviewMode && focusedPage.id === page.id ? ' onepage-page--focused' : ''}`}
            style={{
              gridRow:    page.row + 1,
              gridColumn: page.col + 1,
              // backgroundColor: page.bg,
            }}
            onClick={() => handlePageClick(page)}
          >
            {/* ── Seiteninhalt – hier anpassen ──── */}
            <div className={'onepage-content' + (navEnabled ? '' : ' no-nav')}>
                <page.component />
            </div>
          </div>
        ))}
      </div>
    </div>
    </ThemeProvider>
  );
}
