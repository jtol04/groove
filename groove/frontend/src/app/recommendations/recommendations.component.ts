import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrooveService, Recommendation } from '../services/groove.service';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    .page {
      max-width: 860px;
      margin: 0 auto;
      padding: 2.5rem 1.5rem;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
    }

    .title {
      font-size: 1.3rem;
      font-weight: 700;
      color: #f8fafc;
    }

    .subtitle {
      font-size: 0.8rem;
      color: #475569;
      margin-top: 0.2rem;
    }

    .btn-load {
      background: #6d28d9;
      color: #fff;
      border: none;
      padding: 0.55rem 1.25rem;
      border-radius: 10px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: background 0.15s, transform 0.1s;
    }

    .btn-load:hover {
      background: #5b21b6;
    }

    .btn-load:active {
      transform: scale(0.97);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }

    .rec-card {
      background: #12121f;
      border: 1px solid #1e1e35;
      border-radius: 16px;
      padding: 1rem;
      transition: border-color 0.15s, transform 0.15s;
    }

    .rec-card:hover {
      border-color: #2e2e55;
      transform: translateY(-2px);
    }

    .rec-art {
      width: 100%;
      aspect-ratio: 1;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.25rem;
      margin-bottom: 0.875rem;
    }

    .rec-track {
      font-size: 0.9rem;
      font-weight: 600;
      color: #f1f5f9;
      margin-bottom: 0.2rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .rec-artists {
      font-size: 0.78rem;
      color: #64748b;
      margin-bottom: 0.75rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .match-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .match-bar {
      flex: 1;
      height: 3px;
      background: #1e1e35;
      border-radius: 99px;
      overflow: hidden;
    }

    .match-fill {
      height: 100%;
      background: linear-gradient(90deg, #7c3aed, #ec4899);
      border-radius: 99px;
    }

    .match-pct {
      font-size: 0.72rem;
      color: #64748b;
      min-width: 34px;
      text-align: right;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 160px);
      gap: 1rem;
      text-align: center;
    }

    .empty-icon {
      font-size: 3rem;
      opacity: 0.2;
    }

    .empty-text {
      color: #334155;
      font-size: 0.9rem;
    }
  `],
  template: `
    <div class="page">
      <div class="header">
        <div>
          <h1 class="title">For You</h1>
          <p class="subtitle">Based on your listening history</p>
        </div>
        <button class="btn-load" (click)="load()">
          {{ recs.length ? 'Refresh' : 'Get Recommendations' }}
        </button>
      </div>

      <div *ngIf="recs.length; else empty" class="grid">
        <div class="rec-card" *ngFor="let r of recs">
          <div class="rec-art" [style.background]="getGradient(r.track_name)">♪</div>
          <p class="rec-track">{{ r.track_name }}</p>
          <p class="rec-artists">{{ r.artists }}</p>
          <div class="match-row">
            <div class="match-bar">
              <div class="match-fill" [style.width]="(r.match * 100) + '%'"></div>
            </div>
            <span class="match-pct">{{ (r.match * 100).toFixed(0) }}%</span>
          </div>
        </div>
      </div>

      <ng-template #empty>
        <div class="empty-state">
          <div class="empty-icon">♪</div>
          <p class="empty-text">Rate some songs on Discover to get personalized picks.</p>
        </div>
      </ng-template>
    </div>
  `
})
export class RecommendationsComponent {
  recs: Recommendation[] = [];

  private gradients = [
    'linear-gradient(-45deg, #4c1d95, #7c3aed, #ec4899)',
    'linear-gradient(-45deg, #1e3a5f, #1d4ed8, #06b6d4)',
    'linear-gradient(-45deg, #064e3b, #059669, #34d399)',
    'linear-gradient(-45deg, #7f1d1d, #dc2626, #f97316)',
    'linear-gradient(-45deg, #312e81, #4338ca, #818cf8)',
    'linear-gradient(-45deg, #701a75, #a21caf, #e879f9)',
  ];

  constructor(private groove: GrooveService) {}

  getGradient(name: string): string {
    const idx = name.charCodeAt(0) % this.gradients.length;
    return this.gradients[idx];
  }

  load() {
    this.groove.getRecommendations(8).subscribe(r => this.recs = r);
  }
}
