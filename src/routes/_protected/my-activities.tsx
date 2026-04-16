import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { ActivitiesByCity } from '@/components/saved-activities/activities-by-city'
import { SavedActivityPreviewSkeleton } from '@/components/saved-activities/saved-activity-preview'
import { Skeleton } from '@/components/ui/skeleton'
import { TypographyH1, TypographySmall } from '@/components/ui/typography'

export const Route = createFileRoute('/_protected/my-activities')({
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
      <Suspense
        fallback={
          <div className="flex flex-col gap-10">
            {Array.from({ length: 2 }).map((_, i) => (
              <section key={i}>
                <Skeleton className="h-7 w-32 mb-4" />
                <ul className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <SavedActivityPreviewSkeleton key={j} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        }
      >
        <ActivitiesByCity />
      </Suspense>
    </div>
  )
}
