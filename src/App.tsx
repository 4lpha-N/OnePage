import { useState, useEffect } from 'react'
import './App.scss'
import Book from './projects/Book/Book'
import FlipBook from './projects/FlipBook/FlipBook'
import SideBar from './components/o/SideBar/SideBar'
import OnePage from './projects/OnePage/OnePage'

const primaries = ['red', 'purple', 'blue', 'yellow']

function App() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null)
  const [primary, setPrimary] = useState<typeof primaries[number]>(primaries[0])
  const [onePageActive] = useState(true)

  // Update document root class on theme change
  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }, [theme])

  useEffect(() => {
    document.documentElement.setAttribute('data-primary', primary);
  }, [primary])

  if (onePageActive) {
    return <OnePage />
  }

  return (
    <>
    <div>
      <SideBar theme={theme} primary={primary} primaries={primaries} setTheme={setTheme} setPrimary={setPrimary} />
      <Book />
      <FlipBook />
    </div>
    </>
  )
}

export default App
