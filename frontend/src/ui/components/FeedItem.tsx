import Avatar from "../primitives/Avatar"
import Rating from "../primitives/Rating"
import { useNavigate } from "react-router-dom"

type SpottedItem = { brand?: string; clothingCategory?: string }

function buildDescription(action: string, shopName: string, items?: SpottedItem[]): string {
    if (!items || items.length === 0) return `${action} ${shopName}`
    if (items.length > 2) return `${action} ${items.length} items at ${shopName}`

    const itemNames = items
        .map((i) => [i.brand, i.clothingCategory].filter(Boolean).join(' '))
        .filter(Boolean)

    if (itemNames.length === 0) return `${action} at ${shopName}`
    if (itemNames.length === 1) return `${action} a ${itemNames[0]} at ${shopName}`
    const last = itemNames.pop()
    return `${action} ${itemNames.join(', ')} and ${last} at ${shopName}`
}

export default function FeedItem({
    userName,
    action,
    shopName,
    items,
    rating,
    neighbourhood,
    city,
    date,
    children,
}:{
    userName: string;
    action: string;
    shopName: string;
    items?: SpottedItem[];
    rating?: number;
    neighbourhood?: string;
    city?: string;
    date?: string;
    children?: React.ReactNode;
}) {
    const navigate = useNavigate()
    const location = [neighbourhood, city].filter(Boolean).join(', ')
    const description = buildDescription(action, shopName, items)

    return(
        <div className="p-4 border-b border-gray-200 flex gap-4">
            <div className="shrink-0">
                <Avatar />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-4">
                <div className="flex flex-col">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <span className="min-w-0 wrap-break-word">{userName} {description}</span>
                        {action === 'ranked' && rating != null && <Rating rating={rating} />}
                    </div>
                    {location && (
                        <button
                            type="button"
                            onClick={() => {
                                if (neighbourhood) {
                                    navigate(`/map?neighbourhood=${encodeURIComponent(neighbourhood)}`)
                                }
                            }}
                            className="text-sm text-gray-500 underline decoration-dotted underline-offset-2 text-left w-fit hover:text-blue-700 cursor-pointer"
                            aria-label={neighbourhood ? `View ${neighbourhood} on the map` : undefined}
                        >
                            {location}
                        </button>
                    )}
                </div>
                {children}
            </div>
            {date != null && date !== '' && (
                <span className="shrink-0 text-sm text-gray-500 self-start pt-0.5">{date}</span>
            )}
        </div>
    )
}
