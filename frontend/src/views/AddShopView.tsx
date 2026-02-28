import { useNavigate } from 'react-router-dom'
import AddShopForm from '../components/AddShopForm'

export default function AddShopView() {
  const navigate = useNavigate()

  return (
    <div className="w-full min-w-0 max-w-5xl mx-auto flex flex-col gap-4 mb-24 p-4 overflow-x-hidden">
      <h2 className="text-lg font-medium">Add a shop</h2>
      <AddShopForm
        onSuccess={(shop) => navigate(`/app/shop/${shop.id}`)}
        onBulkSuccess={(shops) => {
          if (shops.length > 0) navigate(`/app/shop/${shops[0].id}`)
        }}
      />
    </div>
  )
}
