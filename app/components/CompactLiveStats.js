'use client';

import { useState, useEffect } from 'react';

export default function CompactLiveStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) {
    return null;
  }

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const formatDuration = (ms) => {
    if (ms < 1000) return Math.round(ms) + 'ms';
    return (ms / 1000).toFixed(1) + 's';
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--surface-soft) 0%, var(--card) 100%)',
      padding: '20px',
      margin: '30px 0',
      borderRadius: '10px',
      border: '1px solid var(--line)',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '15px'
      }}>
        {/* Files Converted 24h */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--muted)', margin: '0 0 5px 0', fontSize: '0.8rem', fontWeight: '600' }}>
            📈 LAST 24H
          </p>
          <p style={{ color: 'var(--ink)', margin: 0, fontSize: '1.6rem', fontWeight: '700' }}>
            {formatNumber(stats.last24h.count)}
          </p>
          <p style={{ color: 'var(--muted)', margin: '3px 0 0 0', fontSize: '0.75rem' }}>
            Files
          </p>
        </div>

        {/* Avg Speed 24h */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--muted)', margin: '0 0 5px 0', fontSize: '0.8rem', fontWeight: '600' }}>
            ⚡ AVG SPEED
          </p>
          <p style={{ color: 'var(--ink)', margin: 0, fontSize: '1.6rem', fontWeight: '700' }}>
            {formatDuration(stats.last24h.avgDuration)}
          </p>
          <p style={{ color: 'var(--muted)', margin: '3px 0 0 0', fontSize: '0.75rem' }}>
            Per File
          </p>
        </div>

        {/* Uptime */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--muted)', margin: '0 0 5px 0', fontSize: '0.8rem', fontWeight: '600' }}>
            ✅ UPTIME
          </p>
          <p style={{ color: 'var(--ink)', margin: 0, fontSize: '1.6rem', fontWeight: '700' }}>
            {stats.uptime}%
          </p>
          <p style={{ color: 'var(--muted)', margin: '3px 0 0 0', fontSize: '0.75rem' }}>
            All Time
          </p>
        </div>

        {/* Total All Time */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--muted)', margin: '0 0 5px 0', fontSize: '0.8rem', fontWeight: '600' }}>
            🌍 ALL TIME
          </p>
          <p style={{ color: 'var(--ink)', margin: 0, fontSize: '1.6rem', fontWeight: '700' }}>
            {formatNumber(stats.allTime.count)}
          </p>
          <p style={{ color: 'var(--muted)', margin: '3px 0 0 0', fontSize: '0.75rem' }}>
            Files
          </p>
        </div>
      </div>
    </div>
  );
}
