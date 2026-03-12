import './Header.scss';
import { CgMenuGridR } from "react-icons/cg";
import { MdControlCamera } from "react-icons/md";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import { CgDarkMode } from "react-icons/cg";
import Button from '@mui/material/Button';
import { Grid } from '@mui/material';

interface HeaderProps {
  classes: string;
  theme: 'light' | 'dark';
  overviewMode: boolean;
  keyboardEnabled: boolean;
  navEnabled: boolean;
  onToggleOverview: () => void;
  onToggleKeyboard: () => void;
  onToggleNav: () => void;
  onToggleTheme: () => void;
}

export default function Header({
  classes,
  overviewMode,
  keyboardEnabled,
  navEnabled,
  onToggleOverview,
  onToggleKeyboard,
  onToggleNav,
  onToggleTheme,
}: HeaderProps) {
  return (
    <header className={`onepage-header ${classes}`}>
      <div className="onepage-header-inner">
        <span className="onepage-header-title">4lpha</span>
        <div className="onepage-header-actions">
          <Button color="primary" size="large" onClick={onToggleTheme} variant={'text'}>
            <CgDarkMode />
          </Button>
          <Button color="primary" size="large" onClick={onToggleOverview} variant={overviewMode ? 'contained' : 'outlined'}>
            <CgMenuGridR />
          </Button>
          <Button color="primary" size="large" onClick={onToggleKeyboard} variant={keyboardEnabled ? 'contained' : 'outlined'}>
            <MdControlCamera />
          </Button>
          <Button color="primary" size="large" onClick={onToggleNav} variant={navEnabled ? 'contained' : 'outlined'}>
            <HiOutlineArrowsExpand />
          </Button>
        </div>
      </div>
    </header>
  );
}
