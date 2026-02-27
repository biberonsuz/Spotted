import ShopCard from "../ui/components/ShopCard";
import ListItem from "../ui/primitives/ListItem";
import FeedItem from "../ui/components/FeedItem";
import ItemSpotted from "../ui/components/ItemSpotted";
import Tag from "../ui/primitives/Tag";
import { useClosestNeighbourhood } from "../hooks/useClosestNeighbourhood";
import { useShops } from "../hooks/useShops";
import { useNavigate } from "react-router-dom";
export default function HomeView() {
    const navigate = useNavigate();
    const { shops, loading } = useShops();
    const neighbourhood = useClosestNeighbourhood(
        "Brick Lane",
        shops?.map((shop) => ({
            coordinates: shop.coordinates,
            neighbourhood: shop.neighbourhood,
        })) ?? [],
    );

    const featuredShop = shops?.[0];

    return(
        <div className="w-full min-w-0 max-w-5xl mx-auto flex flex-col gap-4 mb-24 p-4 overflow-x-hidden">
            <div className="flex flex-row gap-2">
                <button
                    type="button"
                    onClick={() => navigate(`/map?neighbourhood=${encodeURIComponent(neighbourhood)}`)}
                    className="cursor-pointer"
                    aria-label={`View ${neighbourhood} on the map`}
                >
                    <Tag tagName={neighbourhood} icon="navigation" iconRotation={45} />
                </button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="border rounded-xl p-4 border-gray-200 md:col-span-2">
                    <h3 className="text-lg font-medium">For your next trip</h3>
                    {loading && !featuredShop && (
                        <p className="text-sm text-gray-500">Loading shops…</p>
                    )}
                    {featuredShop && (
                        <ShopCard
                            shopId={featuredShop.id}
                            shopName={featuredShop.name}
                            neighbourhood={featuredShop.neighbourhood}
                            city={featuredShop.city}
                            tags={[{ tagName: featuredShop.type }]}
                            brands={["Burberry", "Carhartt", "Dickies"]}
                            rating={8.2}
                            openingHours={featuredShop.opening_hours}
                        />
                    )}
                </div>
                <div className="border rounded-xl p-4 border-gray-200">
                    <h3 className="text-lg font-medium">Latest finds in your area</h3>
                    <div className="flex flex-col gap-2">
                        <ListItem ListItem="MaxMara dress at Mary's Living and Giving Shop Ealing" />
                    </div>
                </div>
            </div>
            <div>
                <h3 className="text-lg font-medium">Your Feed</h3>
                <FeedItem userName="Jason" action="ranked" shopName="Rokit Brick Lane" rating={6.2} neighbourhood="Brick Lane" city="London"></FeedItem>
                <FeedItem userName="Jason" action="spotted" shopName="Rokit Brick Lane" items={[{ brand: "Prada", clothingCategory: "Dress" }, { brand: "COS", clothingCategory: "Jacket" }]} neighbourhood="Brick Lane" city="London">
                    <div className="flex flex-nowrap gap-3 overflow-x-auto md:flex-wrap md:overflow-visible">
                        <ItemSpotted brand="Prada" clothingCategory="Dress" itemColour="Black" hasImage />
                        <ItemSpotted brand="COS" clothingCategory="Jacket" itemColour="Navy" hasImage />
                    </div>
                </FeedItem>
                <FeedItem userName="Alex" action="spotted" shopName="The Brick Lane Vintage Market" items={[{ brand: "Levi's", clothingCategory: "Jeans" }, { brand: "Zara", clothingCategory: "Blazer" }, { brand: "Uniqlo", clothingCategory: "T-shirt" }]} neighbourhood="Brick Lane" city="London">
                    <div className="flex flex-nowrap gap-3 overflow-x-auto md:flex-wrap md:overflow-visible">
                        <ItemSpotted brand="Levi's" clothingCategory="Jeans" itemColour="Blue" hasImage/>
                        <ItemSpotted brand="Zara" clothingCategory="Blazer" itemColour="Grey" hasImage/>
                        <ItemSpotted brand="Uniqlo" clothingCategory="T-shirt" itemColour="White" hasImage/>
                    </div>
                </FeedItem>
            </div>
        </div>
    )
}