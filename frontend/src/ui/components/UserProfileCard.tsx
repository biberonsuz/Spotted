import Avatar from "../primitives/Avatar"

export default function UserProfileCard({
    displayName,
    displayUsername,
    location = "London, UK",
    memberSince,
}: {
    displayName: string
    displayUsername: string
    location?: string
    memberSince?: string | null
}) {
    return (
        <div className="flex items-center gap-4">
            <Avatar size="w-16 h-16" />
            <div>
                <h2 className="text-xl font-semibold">
                    {displayName}{" "}
                    <span className="ml-1 text-sm font-normal text-gray-400">@{displayUsername}</span>
                </h2>
                <p className="text-sm text-gray-500">{location}</p>
                {memberSince && (
                    <p className="text-sm text-gray-400">Member since {memberSince}</p>
                )}
            </div>
        </div>
    )
}
