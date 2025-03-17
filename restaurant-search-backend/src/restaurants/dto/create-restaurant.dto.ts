export class CreateRestaurantDto {
  name: string;
  cuisine: string;
  priceRange: string;
  rating: number;
  location: {
    lat: number;
    lon: number;
  };
  address: string;
  static latitude: number;
  static longitude: number;
  static cuisine: string;
  static minPrice: number;
  static maxPrice: number;
  static rating: number;
  static city: string;
}
