import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  LocationCategory,
  LocationCategoryEnum,
} from '@/services/tripadvisor/api'
import { useRouter } from '@tanstack/react-router'

type Props = {
  currentCategory: LocationCategory,
  currentCity: string
}

export function CategoryDropdown({ currentCategory, currentCity }: Props) {  

  const router = useRouter()

  let currentURL
  if (typeof window !== "undefined")
  {
    currentURL = new URL(window.location.href)
  }
  else{
    return
  }

  const normalizeSearchValue = (val: string | null) => {
    if (!val) return null
    let out: any = val
    // Try to JSON-parse up to 3 times in case values were stringified repeatedly
    for (let i = 0; i < 3; i++) {
      try {
        const parsed = JSON.parse(out)
        out = parsed
      } catch (e) {
        break
      }
    }
    // Ensure we have a plain string without escaped quotes/backslashes
    if (typeof out !== 'string') out = String(out)
    out = out.replace(/\\+/g, '')
    out = out.replace(/^"+|"+$/g, '')
    return out
  }

  const currentParams = {
    city: currentCity,
    category: currentCategory,
    lat: normalizeSearchValue(currentURL.searchParams.get('lat')),
    lng: normalizeSearchValue(currentURL.searchParams.get('lng')),
  }

  const renderSelectItems = () => {
    return LocationCategoryEnum.options.map((item) => {
      const label = String(item)
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
      
      if (item == currentCategory) {
        return (
          <div key={item}>
            <SelectItem value={`${item}`} className="pb-2 text-1xl font-semibold">
              {label}
            </SelectItem>
          </div>
        )
      }

      return (
        <div key={item}>
          <SelectItem value={`${item}`} className="pb-2 text-1xl font-semibold">
            {label}
          </SelectItem>
        </div>
      )
    })
  }

  console.log(`lat: ${currentParams.lat}`)
  console.log(`lng: ${currentParams.lng}`)

  return (
    <Select
      defaultValue={currentCategory}
      onValueChange={(val) =>
        router.navigate({
          to: '/activities/$city',
          params: { city: currentCity },
          search: {
            category: val as LocationCategory,
            lat: currentParams.lat ? currentParams.lat : '0.00',
            lng: currentParams.lng ? currentParams.lng : '0.00',
          },
        })
      }
    >
      <SelectTrigger className="w-[180px] pb-2 text-2xl font-semibold">
          <SelectValue placeholder="Theme" className="capitalize"/>
      </SelectTrigger>
      <SelectContent>
          <SelectGroup>
              {renderSelectItems()}
          </SelectGroup>
      </SelectContent>
    </Select>
  )
}
