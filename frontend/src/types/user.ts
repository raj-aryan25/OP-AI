export interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface RouteRequest {
  origin: Location | null;
  destination: Location | null;
  departureTime?: Date;
}

export interface SwapStation {
  id: string;
  name: string;
  location: Location;
  distanceFromRoute: number; // in km
  estimatedTravelTime: number; // in minutes
  estimatedWaitTime: number; // in minutes
  comfortScore: number; // 0-100
  availableSlots: number;
  batteryInventory: number;
  rating: number; // 0-5
  amenities: string[];
  pricePerSwap: number;
}

export interface SwapRecommendation {
  routeId: string;
  recommendedStations: SwapStation[];
  totalDistance: number;
  estimatedDuration: number;
  generatedAt: Date;
}
