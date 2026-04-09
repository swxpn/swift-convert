export const runtime = 'nodejs';
export const maxDuration = 30;

// Simulate live stats - in a real implementation, this would fetch from your database
// For now, we'll return realistic demo data that increments
function generateStats() {
  // Base stats that increment throughout the day
  const now = new Date();
  const hourOfDay = now.getHours();
  const dayOfMonth = now.getDate();
  
  // Simulate ~200-300 conversions per hour during peak times
  const baseConversions = 5000 + (hourOfDay * 250) + Math.floor(Math.random() * 500);
  const last24h = 5200 + Math.floor(Math.random() * 300);
  
  // Average conversion time varies from 1.5s to 3.5s
  const avgTime = 2000 + Math.floor(Math.random() * 1500);
  
  // Uptime between 99.8% and 99.99%
  const uptime = 99.85 + Math.random() * 0.14;
  
  return {
    last24h: {
      count: last24h,
      avgDuration: avgTime
    },
    allTime: {
      count: baseConversions,
      avgDuration: avgTime - 100
    },
    uptime: parseFloat(uptime.toFixed(2))
  };
}

export async function GET() {
  try {
    const stats = generateStats();
    
    return Response.json(stats, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30'
      }
    });
  } catch (error) {
    console.error('Stats API error:', error);
    
    // Return fallback stats
    return Response.json({
      last24h: {
        count: 5200,
        avgDuration: 2300
      },
      allTime: {
        count: 42150,
        avgDuration: 2100
      },
      uptime: 99.9
    });
  }
}
