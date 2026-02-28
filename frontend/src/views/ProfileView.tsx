import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import ListItem from "../ui/primitives/ListItem"
import FeedItem from "../ui/components/FeedItem"
import UserProfileCard from "../ui/components/UserProfileCard"
import ItemSpotted from "../ui/components/ItemSpotted"
import { useShops } from "../hooks/useShops"
import { useVisitedShops } from "../context/VisitedShopsContext"
import { useCurrentUser } from "../hooks/useCurrentUser"
import { useMemo } from "react"
import { getActivity, type ActivityItem } from "../api/visitedShops"
import { getBrands } from "../api/me"

type SpottedActivityItem = Extract<ActivityItem, { type: 'spotted' }>

type GroupedActivityItem =
  | Extract<ActivityItem, { type: 'visit' | 'ranked' }>
  | { type: 'spotted_group'; shopId: number; shopName: string; at: string; items: SpottedActivityItem[] }

function groupActivityByShop(activity: ActivityItem[]): GroupedActivityItem[] {
  const visitAndRanked: GroupedActivityItem[] = []
  const spottedsByShop = new Map<number, SpottedActivityItem[]>()
  for (const item of activity) {
    if (item.type === 'visit' || item.type === 'ranked') {
      visitAndRanked.push(item)
    } else {
      const list = spottedsByShop.get(item.shopId) ?? []
      list.push(item)
      spottedsByShop.set(item.shopId, list)
    }
  }
  const grouped: GroupedActivityItem[] = [...visitAndRanked]
  for (const [shopId, items] of spottedsByShop) {
    const latest = items.reduce((a, b) => (a.at >= b.at ? a : b))
    grouped.push({ type: 'spotted_group', shopId, shopName: latest.shopName, at: latest.at, items })
  }
  grouped.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
  return grouped
}

export default function ProfileView({
    name: nameProp,
    username: usernameProp,
    brands: brandsProp,
    visitedShops,
}: {
    name?: string
    username?: string
    brands?: string[]
    visitedShops: string[]
}) {
    const { user } = useCurrentUser()
    const { shops } = useShops()
    const { visitedIds } = useVisitedShops()
    const [activity, setActivity] = useState<ActivityItem[]>([])
    const [activityLoading, setActivityLoading] = useState(true)
    const [brands, setBrands] = useState<string[]>(brandsProp ?? [])
    const [brandsLoading, setBrandsLoading] = useState(false)

    useEffect(() => {
        let cancelled = false
        setActivityLoading(true)
        getActivity(15)
            .then((data) => { if (!cancelled) setActivity(data) })
            .catch(() => { if (!cancelled) setActivity([]) })
            .finally(() => { if (!cancelled) setActivityLoading(false) })
        return () => { cancelled = true }
    }, [visitedIds.size])

    useEffect(() => {
        if (!user) {
            setBrands(brandsProp ?? [])
            setBrandsLoading(false)
            return
        }
        let cancelled = false
        setBrandsLoading(true)
        getBrands()
            .then((data) => { if (!cancelled) setBrands(data) })
            .catch(() => { if (!cancelled) setBrands([]) })
            .finally(() => { if (!cancelled) setBrandsLoading(false) })
        return () => { cancelled = true }
    }, [user?.id, brandsProp])

    const groupedActivity = useMemo(() => groupActivityByShop(activity), [activity])

    const displayName = user?.name ?? user?.email ?? nameProp ?? 'You'
    const displayUsername =
        user?.username ?? (user?.email ? user.email.replace(/@.*/, '') : undefined) ?? usernameProp ?? 'user'
    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
        : null

    return(
        <div className="max-w-5xl mx-auto flex flex-col gap-6 p-4">
            <div className="flex items-center justify-between">
                <UserProfileCard
                    displayName={displayName}
                    displayUsername={displayUsername}
                    memberSince={memberSince}
                    avatarUrl={user?.avatarUrl}
                />
                <Link
                    to="/app/settings"
                    className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
                    aria-label="Settings"
                >
                    <span className="material-icons" style={{ fontSize: '28px' }}>settings</span>
                </Link>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-3 border border-gray-200 rounded-xl p-4">
                    <h3 className="text-lg font-medium">Your vibe</h3>
                </div>
                <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Your finds</h3>
                        <Link
                            to="/app/add"
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Add a visit or spotted"
                        >
                            <span className="material-icons" style={{ fontSize: '20px' }}>add</span>
                        </Link>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                        {activityLoading ? (
                            <p className="col-span-3 text-sm text-gray-500">Loading…</p>
                        ) : (() => {
                            const latestSpotteds = activity
                                .filter((a): a is Extract<ActivityItem, { type: 'spotted' }> => a.type === 'spotted')
                                .slice(0, 9)
                            if (latestSpotteds.length === 0) {
                                return <p className="col-span-3 text-sm text-gray-500">No finds yet. Add a visit with spotteds to see them here.</p>
                            }
                            return latestSpotteds.map((item) => (
                                <Link
                                    key={item.spottedId}
                                    to={`/app/shop/${item.shopId}`}
                                    className="block rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors"
                                >
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} alt="" className="w-full aspect-square object-cover max-h-24" />
                                    ) : (
                                        <div className="w-full aspect-square max-h-24 rounded-xl bg-gray-100" />
                                    )}
                                    <div className="p-1.5 bg-gray-50">
                                        <p className="text-xs text-gray-700 truncate">
                                            {[item.brand, item.clothingCategory].filter(Boolean).join(' · ') || 'Spotted'}
                                        </p>
                                    </div>
                                </Link>
                            ))
                        })()}
                    </div>
                </div>
                <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Shops you've visited</h3>
                        <Link
                            to="/app/add"
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Add a visit or spotted"
                        >
                            <span className="material-icons" style={{ fontSize: '20px' }}>add</span>
                        </Link>
                    </div>
                    <div className="mt-2 flex flex-col">
                        {shops
                            ?.filter((shop) => visitedIds.has(shop.id))
                            .map((shop) => (
                                <Link
                                    key={shop.id}
                                    to={`/app/shop/${shop.id}`}
                                    className="block no-underline text-inherit [&>span]:block"
                                >
                                    <ListItem ListItem={shop.name} />
                                </Link>
                            ))}
                    </div>
                </div>
                <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Your brands</h3>
                        <span className="material-icons text-gray-400 cursor-pointer hover:text-gray-600 transition-transform duration-300 hover:rotate-180" style={{ fontSize: '20px' }}>add</span>
                    </div>
                    <div className="mt-2 flex flex-col">
                        {brandsLoading ? (
                            <p className="text-sm text-gray-500">Loading…</p>
                        ) : brands.length === 0 ? (
                            <p className="text-sm text-gray-500">No brands yet.</p>
                        ) : (
                            brands.map((brand) => (
                                <ListItem key={brand} ListItem={brand} />
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="col-span-3">
                <h3 className="text-lg font-medium">Your recent activity</h3>
                {activityLoading ? (
                    <p className="mt-2 text-sm text-gray-500">Loading…</p>
                ) : groupedActivity.length === 0 ? (
                    <p className="mt-2 text-sm text-gray-500">No activity yet. Add a visit or a spotted to see it here.</p>
                ) : (
                    <>
                        {groupedActivity.map((item) => (
                            <ActivityFeedItem
                                key={
                                    item.type === 'visit'
                                        ? `v-${item.visitId}`
                                        : item.type === 'ranked'
                                          ? `r-${item.visitId}`
                                          : `sg-${item.shopId}`
                                }
                                item={item}
                                displayName={displayName}
                                neighbourhood={shops?.find((s) => s.id === item.shopId)?.neighbourhood}
                                city={shops?.find((s) => s.id === item.shopId)?.city}
                            />
                        ))}
                    </>
                )}
            </div>
        </div>
    )
}

function formatActivityDate(iso: string): string {
    const d = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined })
}

function ActivityFeedItem({
    item,
    displayName,
    neighbourhood,
    city,
}: {
    item: GroupedActivityItem
    displayName: string
    neighbourhood?: string
    city?: string
}) {
    const dateStr = formatActivityDate(item.at)
    if (item.type === 'visit') {
        const hasRating = item.rating != null
        return (
            <FeedItem
                userName={displayName}
                action={hasRating ? 'ranked' : 'visited'}
                shopName={item.shopName}
                rating={hasRating ? item.rating! : undefined}
                neighbourhood={neighbourhood}
                city={city}
                date={dateStr}
            />
        )
    }
    if (item.type === 'ranked') {
        return (
            <FeedItem
                userName={displayName}
                action="ranked"
                shopName={item.shopName}
                rating={item.rating}
                neighbourhood={neighbourhood}
                city={city}
                date={dateStr}
            />
        )
    }
    const feedItems = item.items.map((s) => ({
        brand: s.brand ?? undefined,
        clothingCategory: s.clothingCategory ?? undefined,
    }))
    return (
        <FeedItem
            userName={displayName}
            action="spotted"
            shopName={item.shopName}
            items={feedItems}
            neighbourhood={neighbourhood}
            city={city}
            date={dateStr}
        >
            <div className="flex flex-nowrap gap-3 overflow-x-auto md:flex-wrap md:overflow-visible">
                {item.items.map((s) => (
                    <ItemSpotted
                        key={s.spottedId}
                        brand={s.brand ?? undefined}
                        clothingCategory={s.clothingCategory ?? undefined}
                        itemColour={s.colour ?? undefined}
                        hasImage={!!s.imageUrl}
                        imageUrl={s.imageUrl ?? undefined}
                    />
                ))}
            </div>
        </FeedItem>
    )
}
