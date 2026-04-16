import { createFileRoute } from '@tanstack/react-router'
import { ActivitiesByCity } from '@/components/saved-activities/activities-by-city'
import { Suspense } from 'react'
import { TypographyH1, TypographySmall } from '@/components/ui/typography'

export const Route = createFileRoute('/my-activities')({
  component: MyActivitiesPage,
})

function MyActivitiesPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <TypographyH1 className="text-left">My Saved Activities</TypographyH1>
        <TypographySmall>
          All your bookmarked activities, organized by city.
        </TypographySmall>
      </div>
      <Suspense fallback={<p>Loading activities...</p>}>
        <ActivitiesByCity />
      </Suspense>
    </div>
  )
}
