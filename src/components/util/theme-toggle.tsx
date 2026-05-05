import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/util/theme-provider'
import { Button } from '@/components/ui/button'

export function ThemeToggle({
  variant = 'ghost',
}: {
  variant?: 'outline' | 'ghost'
}) {
  const { theme, setTheme } = useTheme()

  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <Button
      variant={variant}
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="font-normal"
    >
      {theme === 'dark' ? <Moon /> : <Sun />}
      <span className="inline sm:hidden">Toggle theme</span>
    </Button>
  )
}
