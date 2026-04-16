import { authClient } from '@/lib/auth-client' //lets us check if the user is logged in (We don't want to try fetching activities for a user that doesn't exist.)
import { useSavedActivities } from '@/hooks/use-saved-activities' //hook that fetches the activities from the database
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { SavedActivityPreview } from '@/components/saved-activities/saved-activity-preview'
import { TypographyH3 } from '@/components/ui/typography'

export function ActivitiesByCity(){
    const {data: session} = authClient.useSession()
    const {userActivitiesQuery}  =  useSavedActivities({}) //fetches all activities for the logged in user, regardless of city. We will filter by city in the UI. We could also create a new hook that accepts a city parameter and only fetches activities for that city, but this is simpler for now.
    const activities = userActivitiesQuery.data // is an array of activity objects
    /*
    {
        id: string
        userId: string
        name: string
        city: string
        description: string | null
        imageUrl: string | null
        timeSlotId: string | null
        trp_location_id: string | null
        fsq_place_id: string | null
    }
     */

    if (!session?.user) {
        return(
            <Alert>
                <AlertTitle>You are not signed in!</AlertTitle>
                <AlertDescription>Sign in to see your saved activities.</AlertDescription>
            </Alert>
        )
    }

    const grouped = activities.reduce<Record<string, typeof activities>>(
        (acc, activity) => {
            const city = activity.city
            if (!acc[city]) acc[city] = []
            acc[city].push(activity)
            return acc
        },
        {},
    )

    const cities = Object.keys(grouped).sort()

    if (cities.length === 0) {
        return(
            <Alert>
                <AlertTitle>No saved activities!</AlertTitle>
                <AlertDescription>Save some activities to see them here.</AlertDescription>
            </Alert>
        )
    }

        return (
        <div className="flex flex-col gap-10">
            {cities.map((city) => (
            <section key={city}>
                <TypographyH3 className="mb-4 border-b pb-2">{city}</TypographyH3>
                <ul className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {grouped[city].map((activity) => (
                    <SavedActivityPreview key={activity.id} id={activity.id} />
                ))}
                </ul>
            </section>
            ))}
        </div>
        )

} 