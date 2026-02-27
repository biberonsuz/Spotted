export default function ListItem(
    {
        ListItem
    }: {
        ListItem: string
    }
) {
    return(
        <span className="block p-2 border-b border-gray-200">
            {ListItem}
        </span>
    )
}