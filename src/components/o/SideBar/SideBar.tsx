import { useState, useEffect } from 'react';
import './SideBar.scss';
import Button from '../../a/Button/Button'

interface SideBarProps {
    theme: string | null;
    primary: string;
    primaries: string[];
    setTheme: (theme: 'light' | 'dark' | null) => void;
    setPrimary: (primary: string) => void;
}

export default function SideBar({ theme, primary, primaries, setTheme, setPrimary }: SideBarProps) {
    const [isOpen, setIsopen] = useState(false);

    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsopen(false);
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleEscKey);
            return () => window.removeEventListener('keydown', handleEscKey);
        }
    }, [isOpen]);

    const toggleSidebar = () => {
        setIsopen(!isOpen);
    }
    return (
        <>
            <div className="container-fluid mt-3">
                
                    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-md">
                        <div className="container-fluid p-2">
                            <a className="navbar-brand text-primary mr-0">Company Logo</a>
                            <div className="form-inline ml-auto">
                                <div className="btn btn-primary" onClick={toggleSidebar} >
                                    Test
                                </div>
                            </div>
                        </div>
                    </nav>
                    <div className={`sidebar ${isOpen == true ? 'active' : ''}`}>
                        <div className="sd-header">
                            <h4 className="mb-0">Sidebar Header</h4>
                            <div className="btn btn-primary" onClick={toggleSidebar}>X</div>
                        </div>
                        <div className="sd-body">
                            <div className="sd-flex">
                                <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} style={{marginLeft: 8}}>
                                    {theme === 'light' ? 'dark' : 'light'} mode
                                </Button>
                                {primaries.map((color) => (
                                    <>
                                    <Button key={color} variant='primary' className={primary === color ? 'Button--active' : ''} onClick={() => setPrimary(color)} style={{marginLeft: 8}}>
                                    {color.charAt(0).toUpperCase() + color.slice(1)}
                                    </Button>
                                    </>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={`sidebar-overlay ${isOpen == true ? 'active' : ''}`} onClick={toggleSidebar}></div>
           </div>
           
        </>
    )
}
