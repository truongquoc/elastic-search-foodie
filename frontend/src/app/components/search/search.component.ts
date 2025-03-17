import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class SearchComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  searchForm: FormGroup;
  suggestions: string[] = [];
  restaurants: any[] = [];
  isLoading = false;
  showSuggestions = false;
  cuisineTypes = ['Italian', 'Japanese', 'Indian', 'Chinese', 'Thai', 'Mexican'];
  priceRanges = ['$', '$$', '$$$', '$$$$'];
  private destroy$ = new Subject<void>();

  constructor(
    private restaurantService: RestaurantService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      latitude: [''],
      longitude: [''],
      radius: ['5km'],
      cuisine: [''],
      priceRange: [''],
      minRating: ['']
    });
  }

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query) return [];
        this.isLoading = true;
        return this.restaurantService.searchRestaurants({ query });
      })
    ).subscribe({
      next: (results) => {
        this.suggestions = results.map((r: any) => r.name);
        this.isLoading = false;
        this.showSuggestions = true;
      },
      error: () => {
        this.isLoading = false;
        this.showSuggestions = false;
      }
    });
  }

  getCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.searchForm.patchValue({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      }, (error) => {
        console.error('Error getting location:', error);
      });
    }
  }

  onSearch() {
    this.isLoading = true;
    this.showSuggestions = false;
    const searchQuery = this.searchControl.value || '';  // Convert null to empty string
    const formValues = this.searchForm.value;

    this.restaurantService.searchRestaurants({
      query: searchQuery,
      lat: formValues.latitude,
      lon: formValues.longitude,
      radius: formValues.radius,
      filters: {
        cuisine: formValues.cuisine,
        priceRange: formValues.priceRange,
        minRating: formValues.minRating
      }
    }).subscribe({
      next: (results) => {
        this.restaurants = results;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  selectSuggestion(suggestion: string) {
    this.searchControl.setValue(suggestion);
    this.showSuggestions = false;
    this.onSearch();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}