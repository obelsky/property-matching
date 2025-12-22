import Image from "next/image";
import { Listing, Request, MatchReasons } from "@/lib/types";
import { formatMatchReasons } from "@/lib/matching";

interface MatchCardProps {
  item: Listing | Request;
  score: number;
  reasons: MatchReasons;
  type: "listing" | "request";
}

export default function MatchCard({
  item,
  score,
  reasons,
  type,
}: MatchCardProps) {
  const isListing = type === "listing";
  const listing = isListing ? (item as Listing) : null;
  const request = !isListing ? (item as Request) : null;

  const propertyTypeLabels = {
    byt: "Byt",
    dum: "Dům",
    pozemek: "Pozemek",
  };

  const reasonsList = formatMatchReasons(reasons);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Fotka nebo placeholder */}
      {isListing && listing?.photos && listing.photos[0] ? (
        <div className="relative h-48 bg-gray-200">
          <Image
            src={listing.photos[0]}
            alt={`${propertyTypeLabels[listing.type]} v ${listing.city}`}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="h-48 bg-zfp-bg-light flex items-center justify-center">
          <div className="text-center text-gray-400">
            <svg
              className="mx-auto h-12 w-12 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <p className="text-sm">Bez fotografie</p>
          </div>
        </div>
      )}

      {/* Obsah */}
      <div className="p-4">
        {/* Header s typem a score */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-heading text-lg font-semibold text-zfp-text">
              {propertyTypeLabels[item.type]}
              {isListing && listing?.layout && ` ${listing.layout}`}
              {!isListing && request?.layout_min && ` ${request.layout_min}+`}
            </h3>
            <p className="text-sm text-gray-600">
              {item.city}
              {item.district && `, ${item.district}`}
            </p>
          </div>
          <div className="bg-brand-orange text-white px-3 py-1 rounded-full text-sm font-semibold">
            {score}%
          </div>
        </div>

        {/* Detaily */}
        <div className="space-y-2 mb-3">
          {isListing && listing?.area_m2 && (
            <p className="text-sm text-gray-700">
              <strong>Plocha:</strong> {listing.area_m2} m²
            </p>
          )}
          {!isListing && request?.area_min_m2 && (
            <p className="text-sm text-gray-700">
              <strong>Min. plocha:</strong> {request.area_min_m2} m²
            </p>
          )}

          {isListing && listing?.price && (
            <p className="text-sm text-gray-700">
              <strong>Cena:</strong>{" "}
              {listing.price.toLocaleString("cs-CZ")} Kč
            </p>
          )}
          {!isListing && request?.budget_max && (
            <p className="text-sm text-gray-700">
              <strong>Max. rozpočet:</strong>{" "}
              {request.budget_max.toLocaleString("cs-CZ")} Kč
            </p>
          )}
        </div>

        {/* Důvody shody */}
        {reasonsList.length > 0 && (
          <div className="border-t pt-3">
            <p className="text-xs font-semibold text-gray-600 mb-2">
              Proč se hodí:
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              {reasonsList.map((reason, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-brand-orange mr-2">✓</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
