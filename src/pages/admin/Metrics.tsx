import React, { useEffect, useState } from 'react';
import { CONFIG } from '@/config';

interface MetricsSummary {
  totalUsers: number;
  totalRecruiters: number;
  totalCandidates: number;
  totalGuestCandidates: number;
  totalNonGuestCandidates: number;
  totalActiveJobPostings: number;
  jobPostingsCreatedLastDays: number;
  recentDays: number;
}

interface RecentMetric {
  jobPostingsCreatedLastDays: number;
  days: number;
}

const Metrics: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentDays, setRecentDays] = useState<number>(30);
  const [recent, setRecent] = useState<RecentMetric | null>(null);
  const [recentLoading, setRecentLoading] = useState(false);

  const format = (n: number) => n.toLocaleString();

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${CONFIG.apiUrl}/stats/summary`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch metrics');
      const data: MetricsSummary = await res.json();
      setMetrics(data);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to fetch metrics';
      setError(message);
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecent = async (days: number) => {
    setRecentLoading(true);
    setError(null);
    try {
      const url = `${CONFIG.apiUrl}/stats/job-postings/recent?days=${encodeURIComponent(days)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch recent job postings metric');
      const data: RecentMetric = await res.json();
      setRecent(data);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to fetch recent job postings metric';
      setError(message);
      setRecent(null);
    } finally {
      setRecentLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const onApplyDays = (e: React.FormEvent) => {
    e.preventDefault();
    const safeDays = Number.isFinite(recentDays) && recentDays > 0 ? Math.floor(recentDays) : 30;
    setRecentDays(safeDays);
    if (safeDays === 30) {
      // Use the summary-provided metric for 30 days
      setRecent(null);
    } else {
      fetchRecent(safeDays);
    }
  };

  const onRefresh = () => {
    if (recentDays === 30) {
      fetchSummary();
    } else {
      fetchRecent(recentDays);
    }
  };

  const effectiveRecentDays = recent?.days ?? metrics?.recentDays ?? 30;
  const effectiveRecentCount = recent?.jobPostingsCreatedLastDays ?? metrics?.jobPostingsCreatedLastDays ?? 0;

  return (
    <div style={{ padding: '2rem', maxWidth: 720 }}>
      <h2 style={{ marginBottom: '0.5rem' }}>System Metrics</h2>
      <div style={{ color: '#555', fontSize: 14 }}>
        Base URL: <code>{CONFIG.apiUrl}</code>
      </div>

      <form onSubmit={onApplyDays} style={{ margin: '1rem 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <label htmlFor="recentDays">Recent window (days):</label>
        <input
          id="recentDays"
          type="number"
          min={1}
          value={recentDays}
          onChange={(e) => setRecentDays(parseInt(e.target.value || '0', 10))}
          style={{ width: 100, padding: '4px 6px' }}
        />
        <button type="submit" disabled={loading || recentLoading} style={{ padding: '6px 10px' }}>Apply</button>
        <button type="button" disabled={loading || recentLoading} onClick={onRefresh} style={{ padding: '6px 10px' }}>Refresh</button>
      </form>

      {(loading || recentLoading) && <div aria-live="polite">Loading metrics...</div>}
      {error && <div role="alert" style={{ color: '#b00020' }}>Error: {error}</div>}

      {!loading && metrics && (
        <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 16 }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
            <li><strong>Total Users:</strong> {format(metrics.totalUsers)}</li>
            <li><strong>Total Recruiters:</strong> {format(metrics.totalRecruiters)}</li>
            <li><strong>Total Candidates:</strong> {format(metrics.totalCandidates)}</li>
            <li><strong>Total Guest Candidates:</strong> {format(metrics.totalGuestCandidates)}</li>
            <li><strong>Total Non-Guest Candidates:</strong> {format(metrics.totalNonGuestCandidates)}</li>
            <li><strong>Total Active Job Postings:</strong> {format(metrics.totalActiveJobPostings)}</li>
            <li style={{ gridColumn: '1 / -1' }}>
              <strong>Job Postings Created (last {effectiveRecentDays} days):</strong> {format(effectiveRecentCount)}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Metrics;
