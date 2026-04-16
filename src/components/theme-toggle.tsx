import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <Button variant="ghost" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'dark' ? <Moon /> : <Sun />}
    </Button>
  )
}
