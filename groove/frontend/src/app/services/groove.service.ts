import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Song {
  track_id: string;
  artists: string;
  album_name: string;
  track_name: string;
}

export interface SwipeResponse {
  track_id: string;
  liked: boolean;
  total_swipes: number;
}

export interface Recommendation {
  track_name: string;
  artists: string;
  match: number;
}

@Injectable({ providedIn: 'root' })
export class GrooveService {
  private api = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getSongs(limit: number = 5): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.api}/songs`, { params: { limit } });
  }

  swipe(track_id: string, liked: boolean): Observable<SwipeResponse> {
    return this.http.post<SwipeResponse>(`${this.api}/swipe`, { track_id, liked });
  }

  getRecommendations(n: number = 8): Observable<Recommendation[]> {
    return this.http.get<Recommendation[]>(`${this.api}/recommendations`, { params: { n } });
  }
}