import Tag from '../primitives/Tag'
import { isShopOpen } from '../../utils/isShopOpen'

export default function OpenStatusTag({
  shop,
}: {
  shop: { opening_hours: Record<string, string> }
}) {
  return isShopOpen(shop) ? (
    <Tag tagName="Open Now" bgColor="bg-green-100" textColor="text-green-800" />
  ) : (
    <Tag tagName="Closed" bgColor="bg-red-100" textColor="text-red-800" />
  )
}
