import { AlertCircleIcon } from 'lucide-react'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface CustomErrorComponentProps extends ErrorComponentProps {
  description?: string
}

export function ErrorComponent({
  error,
  description,
}: CustomErrorComponentProps) {
  return (
    <div className="flex-1 self-center flex flex-col items-center justify-center p-4">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircleIcon />
        <AlertTitle>{error.name}</AlertTitle>
        <AlertDescription>
          {description} ({error.message})
        </AlertDescription>
      </Alert>
    </div>
  )
}
