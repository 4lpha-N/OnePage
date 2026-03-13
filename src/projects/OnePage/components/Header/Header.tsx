import React from 'react';
import './Header.scss';
import { CgMenuGridR } from "react-icons/cg";
import { MdControlCamera } from "react-icons/md";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import { CgDarkMode } from "react-icons/cg";
import { TbMenu2 } from "react-icons/tb";
import Button from '@mui/material/Button';
import { Box, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';

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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <header className={`onepage-header ${classes}`}>
      <div className="onepage-header-inner">
        <span className="onepage-header-title">4lpha</span>
        <div className="onepage-header-actions">

          {/* ── Buttons: ab md sichtbar ───────────────── */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <Button color="primary" size="large" onClick={onToggleTheme} variant="text">
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
          </Box>

          {/* ── Hamburger-Menü: unter md sichtbar ────── */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
            <Tooltip title="Menü">
              <IconButton
                onClick={handleMenuOpen}
                // color="primary"
                size="large"
                aria-controls={open ? 'header-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
                <TbMenu2 />
              </IconButton>
            </Tooltip>
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="header-menu"
            open={open}
            onClose={handleMenuClose}
            disableScrollLock
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => { onToggleTheme(); handleMenuClose(); }}>
              <Typography noWrap style={{ padding: '2px 8px' }}>
                <CgDarkMode />
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => { onToggleOverview(); handleMenuClose(); }}>
              <Typography color={overviewMode ? 'primary' : ''} noWrap style={{ padding: '2px 8px' }}>
                <CgMenuGridR />
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => { onToggleKeyboard(); handleMenuClose(); }}>
              <Typography color={keyboardEnabled ? 'primary' : ''} noWrap style={{ padding: '2px 8px' }}>
                <MdControlCamera />
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => { onToggleNav(); handleMenuClose(); }}>
              <Typography color={navEnabled ? 'primary' : ''} noWrap style={{ padding: '2px 8px' }}>
                <HiOutlineArrowsExpand />
              </Typography>
            </MenuItem>
          </Menu>

        </div>
      </div>
    </header>
  );
}
