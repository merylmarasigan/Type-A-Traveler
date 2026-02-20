import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ErrorComponentProps } from '@tanstack/react-router'
import { AlertCircleIcon } from 'lucide-react'

interface CustomErrorComponentProps extends ErrorComponentProps {
  description?: string
}

export function ErrorComponent({
  error,
  description,
}: CustomErrorComponentProps) {
  return (
    <Alert variant="destructive" className="max-w-md">
      <AlertCircleIcon />
      <AlertTitle>{error.name}</AlertTitle>
      <AlertDescription>{description ?? error.message}</AlertDescription>
    </Alert>
  )
}
