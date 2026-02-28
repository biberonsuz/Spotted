import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Tag from "../ui/primitives/Tag";
import RoundButton from "../ui/primitives/RoundButton";
import OpenStatusTag from "../ui/components/OpenStatusTag";
import Dropdown from "../ui/components/Dropdown";
import ItemSpotted from "../ui/components/ItemSpotted";
import ShopMap from "../ui/components/ShopMap";
import type { Shop } from "../types/shop";
import { getShop, getShopSpotteds } from "../api/shops";
import type { ShopSpotted } from "../api/shops";
import { useVisitedShops } from "../context/VisitedShopsContext";

export default function ShopView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [shop, setShop] = useState<Shop | null>(null);
  const [spotteds, setSpotteds] = useState<ShopSpotted[]>([]);
  const [loading, setLoading] = useState(true);
  const { visitedIds, toggleVisited } = useVisitedShops();

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const [shopData, spottedsData] = await Promise.all([
          getShop(Number(id)),
          getShopSpotteds(Number(id)),
        ]);
        if (!cancelled) {
          setShop(shopData);
          setSpotteds(spottedsData);
        }
      } catch {
        if (!cancelled) {
          setShop(null);
          setSpotteds([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!loading && !shop) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <p className="text-gray-600">Shop not found.</p>
        <Link to="/" className="text-blue-600 underline mt-2 inline-block">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6 pt-6 pb-24">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="self-start flex items-center gap-1 text-gray-600 hover:text-gray-900 cursor-pointer"
        aria-label="Go back"
      >
        <span className="material-icons" style={{ fontSize: "24px" }}>
          arrow_back
        </span>
        Back
      </button>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="w-full sm:w-80 h-56 sm:h-64 rounded-xl shrink-0 overflow-hidden">
          {shop && (
            <ShopMap
              longitude={shop.coordinates.longitude}
              latitude={shop.coordinates.latitude}
            />
          )}
        </div>
        <div className="flex flex-col gap-4 min-w-0">
          <div>
            {loading && !shop && (
              <p className="text-gray-500 mt-1">Loading shop…</p>
            )}
            {shop && (
              <>
                <h1 className="text-2xl font-semibold text-gray-900">{shop.name}</h1>
                <p className="text-gray-500 mt-1">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/map?neighbourhood=${encodeURIComponent(shop.neighbourhood)}`)
                    }
                    className="underline decoration-dotted underline-offset-2 hover:text-blue-700 cursor-pointer"
                    aria-label={`View ${shop.neighbourhood} on the map`}
                  >
                    {shop.neighbourhood}
                  </button>
                  {`, ${shop.city}`}
                </p>
              </>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              {shop && (
                <>
                  <Tag tagName={shop.type} />
                  <OpenStatusTag shop={shop} />
                </>
              )}
            </div>
            {shop && (
              <RoundButton
                highlighted
                className="mt-3"
                onClick={() => toggleVisited(shop.id)}
              >
                <span className="material-icons" style={{ fontSize: "18px" }}>
                  {visitedIds.has(shop.id) ? "check" : "add"}
                </span>
              </RoundButton>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <span
                className="material-icons text-gray-400 shrink-0"
                style={{ fontSize: "20px" }}
              >
                location_on
              </span>
              <p className="text-sm text-gray-600">{shop?.address}</p>
            </div>
            <div className="flex items-start gap-2">
              <span
                className="material-icons text-gray-400 shrink-0"
                style={{ fontSize: "20px" }}
              >
                schedule
              </span>
              {shop && (
                <Dropdown label="Opening hours">
                  {Object.entries(shop.opening_hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between gap-4">
                      <span className="capitalize">{day}</span>
                      <span>{hours}</span>
                    </div>
                  ))}
                </Dropdown>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium">Spotted Here</h3>
        {spotteds.length === 0 && !loading && (
          <p className="text-sm text-gray-500 mt-2">No items spotted at this shop yet.</p>
        )}
        <div className="flex flex-nowrap gap-2 overflow-x-auto mt-3 md:grid md:grid-cols-4 md:overflow-visible">
          {spotteds.map((item) => (
            <ItemSpotted
              key={item.id}
              brand={item.brand ?? undefined}
              clothingCategory={item.clothingCategory ?? undefined}
              itemColour={item.colour ?? undefined}
              hasImage
              imageUrl={item.imageUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
