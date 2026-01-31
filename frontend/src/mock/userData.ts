import type { Location, SwapStation, SwapRecommendation } from '../types/user';

export const mockLocations: Location[] = [
  {
    id: 'loc1',
    name: 'Downtown Business District',
    address: '123 Main Street, City Center',
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  {
    id: 'loc2',
    name: 'Airport Terminal',
    address: 'International Airport, Terminal 2',
    coordinates: { lat: 40.6413, lng: -73.7781 }
  },
  {
    id: 'loc3',
    name: 'Tech Park North',
    address: '456 Innovation Drive, North District',
    coordinates: { lat: 40.7589, lng: -73.9851 }
  },
  {
    id: 'loc4',
    name: 'Residential Complex West',
    address: '789 Sunset Boulevard, West End',
    coordinates: { lat: 40.7282, lng: -74.0776 }
  },
  {
    id: 'loc5',
    name: 'Shopping Mall East',
    address: '321 Commerce Plaza, East Side',
    coordinates: { lat: 40.7489, lng: -73.9680 }
  }
];

export const mockSwapStations: SwapStation[] = [
  {
    id: 'station-swap-1',
    name: 'Central Swap Hub',
    location: {
      id: 'swap-loc-1',
      name: 'Central Swap Hub',
      address: '100 Energy Street, Midtown',
      coordinates: { lat: 40.7350, lng: -73.9950 }
    },
    distanceFromRoute: 2.3,
    estimatedTravelTime: 8,
    estimatedWaitTime: 5,
    comfortScore: 92,
    availableSlots: 8,
    batteryInventory: 45,
    rating: 4.8,
    amenities: ['WiFi', 'Cafe', 'Restrooms', 'Lounge'],
    pricePerSwap: 12.99
  },
  {
    id: 'station-swap-2',
    name: 'QuickSwap Express',
    location: {
      id: 'swap-loc-2',
      name: 'QuickSwap Express',
      address: '250 Highway Junction, Route 95',
      coordinates: { lat: 40.7180, lng: -74.0100 }
    },
    distanceFromRoute: 0.8,
    estimatedTravelTime: 3,
    estimatedWaitTime: 12,
    comfortScore: 78,
    availableSlots: 4,
    batteryInventory: 28,
    rating: 4.2,
    amenities: ['WiFi', 'Vending Machines'],
    pricePerSwap: 9.99
  },
  {
    id: 'station-swap-3',
    name: 'Premium Power Plaza',
    location: {
      id: 'swap-loc-3',
      name: 'Premium Power Plaza',
      address: '500 Luxury Lane, Uptown',
      coordinates: { lat: 40.7650, lng: -73.9800 }
    },
    distanceFromRoute: 4.1,
    estimatedTravelTime: 15,
    estimatedWaitTime: 2,
    comfortScore: 98,
    availableSlots: 12,
    batteryInventory: 60,
    rating: 4.9,
    amenities: ['WiFi', 'Cafe', 'Restrooms', 'Lounge', 'Massage Chairs', 'EV Charging'],
    pricePerSwap: 19.99
  },
  {
    id: 'station-swap-4',
    name: 'EcoSwap Station',
    location: {
      id: 'swap-loc-4',
      name: 'EcoSwap Station',
      address: '75 Green Avenue, Park District',
      coordinates: { lat: 40.7450, lng: -73.9750 }
    },
    distanceFromRoute: 1.5,
    estimatedTravelTime: 6,
    estimatedWaitTime: 8,
    comfortScore: 85,
    availableSlots: 6,
    batteryInventory: 35,
    rating: 4.6,
    amenities: ['WiFi', 'Restrooms', 'Solar Panels'],
    pricePerSwap: 11.49
  },
  {
    id: 'station-swap-5',
    name: 'Budget Swap Point',
    location: {
      id: 'swap-loc-5',
      name: 'Budget Swap Point',
      address: '88 Economy Road, Industrial Zone',
      coordinates: { lat: 40.7100, lng: -74.0200 }
    },
    distanceFromRoute: 3.2,
    estimatedTravelTime: 11,
    estimatedWaitTime: 18,
    comfortScore: 65,
    availableSlots: 3,
    batteryInventory: 20,
    rating: 3.8,
    amenities: ['Vending Machines'],
    pricePerSwap: 7.99
  }
];

export const mockSwapRecommendation: SwapRecommendation = {
  routeId: 'route-001',
  recommendedStations: mockSwapStations,
  totalDistance: 45.8,
  estimatedDuration: 52,
  generatedAt: new Date()
};
