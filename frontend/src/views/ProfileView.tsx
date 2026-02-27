import { Link } from "react-router-dom"
import Avatar from "../ui/primitives/Avatar"
import ListItem from "../ui/primitives/ListItem"
import ImageThumbnail from "../ui/primitives/ImageThumbnail"
import { useShops } from "../hooks/useShops"
import { useVisitedShops } from "../context/VisitedShopsContext"
import { useCurrentUser } from "../hooks/useCurrentUser"

export default function ProfileView({
    name: nameProp,
    username: usernameProp,
    brands,
    visitedShops,
}: {
    name?: string
    username?: string
    brands: string[]
    visitedShops: string[]
}) {
    const { user } = useCurrentUser()
    const { shops } = useShops()
    const { visitedIds } = useVisitedShops()

    const displayName = user?.name ?? user?.email ?? nameProp ?? 'You'
    const displayUsername = user?.email ? user.email.replace(/@.*/, '') : usernameProp ?? 'user'
    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
        : null

    return(
        <div className="max-w-5xl mx-auto flex flex-col gap-6 p-4">
            <div className="flex items-center gap-4">
                <Avatar size="w-16 h-16" />
                <div>
                    <h2 className="text-xl font-semibold">{displayName} <span className="ml-1 text-sm font-normal text-gray-400">@{displayUsername}</span></h2>
                    <p className="text-sm text-gray-500">London, UK</p>
                    {memberSince && <p className="text-sm text-gray-400">Member since {memberSince}</p>}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-3 border border-gray-200 rounded-xl p-4">
                    <h3 className="text-lg font-medium">Your vibe</h3>
                </div>
                <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Your finds</h3>
                        <span className="material-icons text-gray-400 cursor-pointer hover:text-gray-600 transition-transform duration-300 hover:rotate-180" style={{ fontSize: '20px' }}>add</span>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <ImageThumbnail key={i} />
                        ))}
                    </div>
                </div>
                <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Shops you've visited</h3>
                        <span className="material-icons text-gray-400 cursor-pointer hover:text-gray-600 transition-transform duration-300 hover:rotate-180" style={{ fontSize: '20px' }}>add</span>
                    </div>
                    <div className="mt-2 flex flex-col">
                        {shops
                            ?.filter((shop) => visitedIds.has(shop.id))
                            .map((shop) => (
                                <Link
                                    key={shop.id}
                                    to={`/shop/${shop.id}`}
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
                        {brands.map((brand) => (
                            <ListItem key={brand} ListItem={brand} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
