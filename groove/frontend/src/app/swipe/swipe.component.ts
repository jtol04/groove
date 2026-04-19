import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrooveService, Song } from '../services/groove.service';

@Component({
  selector: 'app-swipe',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    .page {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 60px);
      padding: 2rem 1rem;
    }

    .card-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.75rem;
      width: 100%;
      max-width: 340px;
    }

    .card {
      width: 100%;
      border-radius: 20px;
      background: #12121f;
      border: 1px solid #1e1e35;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }

    .album-art {
      width: 100%;
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 5rem;
      background-size: 300% 300%;
      animation: shift 10s ease infinite;
    }

    @keyframes shift {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .song-info {
      padding: 1.25rem 1.25rem 1.5rem;
    }

    .track-name {
      font-size: 1.1rem;
      font-weight: 700;
      color: #f8fafc;
      margin-bottom: 0.35rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .artists {
      font-size: 0.875rem;
      color: #94a3b8;
      margin-bottom: 0.2rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .album {
      font-size: 0.78rem;
      color: #475569;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .actions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2rem;
    }

    .btn-action {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: 2px solid transparent;
      cursor: pointer;
      font-size: 1.4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #12121f;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .btn-skip {
      border-color: #ef4444;
      color: #ef4444;
    }

    .btn-like {
      width: 68px;
      height: 68px;
      border-color: #22c55e;
      color: #22c55e;
      font-size: 1.6rem;
    }

    .btn-skip:hover {
      transform: scale(1.1);
      box-shadow: 0 0 24px rgba(239, 68, 68, 0.35);
    }

    .btn-like:hover {
      transform: scale(1.1);
      box-shadow: 0 0 24px rgba(34, 197, 94, 0.35);
    }

    .btn-skip:active, .btn-like:active {
      transform: scale(0.95);
    }

    .count {
      font-size: 0.78rem;
      color: #334155;
      letter-spacing: 0.02em;
    }

    .loading {
      color: #475569;
      font-size: 0.9rem;
    }
  `],
  template: `
    <div class="page">
      <div *ngIf="currentSong; else loading" class="card-wrap">
        <div class="card">
          <div class="album-art" [style.background]="getGradient(currentSong.track_name)">♪</div>
          <div class="song-info">
            <h2 class="track-name">{{ currentSong.track_name }}</h2>
            <p class="artists">{{ currentSong.artists }}</p>
            <p class="album">{{ currentSong.album_name }}</p>
          </div>
        </div>
        <div class="actions">
          <button class="btn-action btn-skip" (click)="onSwipe(false)" title="Skip">✕</button>
          <button class="btn-action btn-like" (click)="onSwipe(true)" title="Like">♥</button>
        </div>
        <p class="count">{{ swipeCount }} {{ swipeCount === 1 ? 'song' : 'songs' }} rated</p>
      </div>
      <ng-template #loading>
        <p class="loading">Loading songs...</p>
      </ng-template>
    </div>
  `
})
export class SwipeComponent implements OnInit {
  songs: Song[] = [];
  currentSong: Song | null = null;
  swipeCount = 0;

  private gradients = [
    'linear-gradient(-45deg, #4c1d95, #7c3aed, #ec4899)',
    'linear-gradient(-45deg, #1e3a5f, #1d4ed8, #06b6d4)',
    'linear-gradient(-45deg, #064e3b, #059669, #34d399)',
    'linear-gradient(-45deg, #7f1d1d, #dc2626, #f97316)',
    'linear-gradient(-45deg, #312e81, #4338ca, #818cf8)',
    'linear-gradient(-45deg, #701a75, #a21caf, #e879f9)',
  ];

  constructor(private groove: GrooveService) {}

  ngOnInit() {
    this.loadSongs();
  }

  getGradient(name: string): string {
    const idx = name.charCodeAt(0) % this.gradients.length;
    return this.gradients[idx];
  }

  loadSongs() {
    this.groove.getSongs(10).subscribe(songs => {
      this.songs = songs;
      this.nextSong();
    });
  }

  nextSong() {
    this.currentSong = this.songs.length > 0 ? this.songs.shift()! : null;
    if (!this.currentSong) this.loadSongs();
  }

  onSwipe(liked: boolean) {
    if (!this.currentSong) return;
    this.groove.swipe(this.currentSong.track_id, liked).subscribe(res => {
      this.swipeCount = res.total_swipes;
      this.nextSong();
    });
  }
}
