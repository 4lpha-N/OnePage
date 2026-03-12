import { useState } from 'react';
import './Book.scss';

const PAGES = ['Page 1', 'Page 2', 'Page 3', 'Page 4', 'Page 5', 'Page 6'];

export default function Book() {
  // Maximale Spread-Anzahl berechnen (Solo + Doppelseiten + ggf. letzte Einzelseite)
  const maxSpread = Math.ceil((PAGES.length - 1) / 2);
  const [isOpen, setIsOpen] = useState(false);
  const [currentSpread, setCurrentSpread] = useState(0);
  const [isSwitching, setIsSwitching] = useState(false);

  const handleOpenClose = () => setIsOpen((open) => !open);

  const goToSpread = (spread: number) => {
    if (isSwitching) return; // Buffer: Klicks während Wechsel ignorieren
    if (spread >= 0 && spread <= Math.ceil(PAGES.length / 2)) {
      setIsSwitching(true);
      setTimeout(() => {
        setCurrentSpread(spread);
        setIsSwitching(false);
      }, 200);
    }
  };

  // Spread-Rendering passend zur Navigation
  let leftPage = null;
  let rightPage = null;
  if (currentSpread === 0) {
    // Solo: Seite 1
    rightPage = (
      <div className="book-page right solo" style={{ left: '50%', right: 'auto', visibility: 'visible' }}>
        <div className="page-content">{PAGES[0]}</div>
      </div>
    );
  } else {
    const leftIdx = 1 + (currentSpread - 1) * 2;
    const rightIdx = leftIdx + 1;
    if (leftIdx < PAGES.length) {
      leftPage = (
        <div className="book-page left" style={{ visibility: 'visible' }}>
          <div className="page-content">{PAGES[leftIdx]}</div>
        </div>
      );
    }

    if (rightIdx < PAGES.length) {
      rightPage = (
        <div className="book-page right" style={{ visibility: 'visible' }}>
          <div className="page-content">{PAGES[rightIdx]}</div>
        </div>
      );
    } else {
      rightPage = <div className="book-page right" style={{ visibility: 'hidden' }}></div>;
    }
  }

  return (
    <div className={`book-container ${isOpen ? 'open' : 'closed'}`}>
      <button className="book-toggle" onClick={handleOpenClose}>
        {isOpen ? 'Close' : 'Open'}
      </button>
      <div className="book">
        {/* Cover liegt immer oben, wird aber im offenen Zustand per CSS ausgeblendet */}
        <div className={`book-cover${isOpen ? ' open' : ''}`}>
          <div className="cover-content">Cover</div>
        </div>
        {/* Seiten */}
        {isOpen && (
          <>
            {leftPage}
            {rightPage}
          </>
        )}
      </div>
      {isOpen && (
        <div className="book-navigation">
          <button onClick={() => goToSpread(currentSpread - 1)} disabled={currentSpread === 0}>
            ◀
          </button>
          {Array.from({ length: maxSpread + 1 }, (_, spreadIdx) => {
            let label;
            if (spreadIdx === 0) {
              label = '1';
            } else {
              const left = 1 + (spreadIdx - 1) * 2;
              const right = left + 1;
              if (right < PAGES.length) {
                label = `${left + 1}/${right + 1}`;
              } else {
                label = `${left + 1}`;
              }
            }

            return (
              <button
                key={spreadIdx}
                className={currentSpread === spreadIdx ? 'active' : ''}
                onClick={() => goToSpread(spreadIdx)}
              >
                {label}
              </button>
            );
          })}
          <button onClick={() => goToSpread(currentSpread + 1)} disabled={currentSpread >= maxSpread}>
            ▶
          </button>
        </div>
      )}
    </div>
  );
}
