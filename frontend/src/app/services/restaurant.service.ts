import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface SearchFilters {
  cuisine?: string;
  priceRange?: string;
  minRating?: number;
}

interface SearchParams {
  query?: string;
  lat?: number;
  lon?: number;
  radius?: string;
  filters?: SearchFilters;
}

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private apiUrl = `${environment.apiUrl}/restaurants`;

  constructor(private http: HttpClient) {}

  searchRestaurants(params: SearchParams): Observable<any> {
    let httpParams = new HttpParams();

    if (params.query) {
      httpParams = httpParams.set('query', params.query);
    }
    if (params.lat) {
      httpParams = httpParams.set('lat', params.lat.toString());
    }
    if (params.lon) {
      httpParams = httpParams.set('lon', params.lon.toString());
    }
    if (params.radius) {
      httpParams = httpParams.set('radius', params.radius);
    }
    if (params.filters) {
      const { cuisine, priceRange, minRating } = params.filters;
      if (cuisine) {
        httpParams = httpParams.set('cuisine', cuisine);
      }
      if (priceRange) {
        httpParams = httpParams.set('priceRange', priceRange);
      }
      if (minRating) {
        httpParams = httpParams.set('minRating', minRating.toString());
      }
    }

    return this.http.get(`${this.apiUrl}/search`, { params: httpParams });
  }

  getAutoComplete(query: string): Observable<any> {
    const params = new HttpParams().set('query', query);
    return this.http.get(`${this.apiUrl}/autocomplete`, { params });
  }
}