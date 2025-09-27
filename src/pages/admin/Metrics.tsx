import React, { useEffect, useState } from 'react';
import { CONFIG } from '@/config';
import { useAuth } from '@/context/AuthContext';
import { fetchWithAuth } from '@/services/fetchWithAuth';

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

const Metrics: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentDays, setRecentDays] = useState<number>(30);
  const { user, logout } = useAuth();

  const format = (n: number) => n.toLocaleString();

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${CONFIG.apiUrl}/stats/summary?recentDays=${recentDays}`;
      const res = await fetchWithAuth(url, {
        method: 'GET'
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch metrics (${res.status})`);
      }
      
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



  useEffect(() => {
    fetchSummary();
  }, []);

  const onApplyDays = (e: React.FormEvent) => {
    e.preventDefault();
    const safeDays = Number.isFinite(recentDays) && recentDays > 0 ? Math.floor(recentDays) : 30;
    setRecentDays(safeDays);
    // Refetch summary with new recentDays parameter
    fetchSummary();
  };

  const onRefresh = () => {
    fetchSummary();
  };

  const effectiveRecentDays = metrics?.recentDays ?? recentDays;
  const effectiveRecentCount = metrics?.jobPostingsCreatedLastDays ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">System Metrics</h1>
            <p className="text-gray-600">Overview of platform usage and activity</p>
            <div className="mt-2 text-sm text-gray-500">
              API Base: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{CONFIG.apiUrl}</code>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Welcome, <span className="font-medium">{user?.email}</span>
            </div>
            <button
              onClick={() => logout && logout()}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <form onSubmit={onApplyDays} className="flex items-center gap-4">
            <label htmlFor="recentDays" className="text-sm font-medium text-gray-700">
              Recent window (days):
            </label>
            <input
              id="recentDays"
              type="number"
              min={1}
              value={recentDays}
              onChange={(e) => setRecentDays(parseInt(e.target.value || '0', 10))}
              className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Apply
            </button>
            <button 
              type="button" 
              disabled={loading} 
              onClick={onRefresh}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Refresh
            </button>
          </form>
        </div>

        {loading && (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading metrics...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Loading Metrics</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <p className="text-xs text-red-600 mt-2">
                  This might be a temporary server issue. Try refreshing in a few moments.
                </p>
              </div>
            </div>
          </div>
        )}

        {!loading && metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Users Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-3.5a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{format(metrics.totalUsers)}</p>
                </div>
              </div>
            </div>

            {/* Total Recruiters Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V8m8 0V6a2 2 0 00-2-2H10a2 2 0 00-2 2v2" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Recruiters</p>
                  <p className="text-2xl font-bold text-gray-900">{format(metrics.totalRecruiters)}</p>
                </div>
              </div>
            </div>

            {/* Total Candidates Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Candidates</p>
                  <p className="text-2xl font-bold text-gray-900">{format(metrics.totalCandidates)}</p>
                </div>
              </div>
            </div>

            {/* Guest Candidates Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-100">
                  <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Guest Candidates</p>
                  <p className="text-2xl font-bold text-gray-900">{format(metrics.totalGuestCandidates)}</p>
                </div>
              </div>
            </div>

            {/* Registered Candidates Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-indigo-100">
                  <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Registered Candidates</p>
                  <p className="text-2xl font-bold text-gray-900">{format(metrics.totalNonGuestCandidates)}</p>
                </div>
              </div>
            </div>

            {/* Active Job Postings Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-teal-100">
                  <svg className="h-6 w-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Job Postings</p>
                  <p className="text-2xl font-bold text-gray-900">{format(metrics.totalActiveJobPostings)}</p>
                </div>
              </div>
            </div>

            {/* Recent Job Postings Card - Full width */}
            <div className="bg-white rounded-lg shadow p-6 md:col-span-2 lg:col-span-3">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Job Postings Created (last {effectiveRecentDays} days)
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{format(effectiveRecentCount)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Metrics;
