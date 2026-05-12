import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell
} from 'recharts';
import { Users, Eye, Clock, Activity, Globe, Monitor, MousePointerClick } from 'lucide-react';
import * as FlagIcons from 'country-flag-icons/react/3x2';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { motion } from 'framer-motion';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6'];

function isUnknownCountryId(rawId) {
  if (rawId == null || rawId === '') return true;
  const s = String(rawId).trim();
  return s.toLowerCase() === 'unknown' || s === 'UnKnown';
}

function getCountryParts(rawId, regionNames) {
  if (isUnknownCountryId(rawId)) {
    return { code: null, label: 'Unknown', Flag: null };
  }
  const str = String(rawId).trim();
  if (/^[A-Za-z]{2}$/.test(str)) {
    const code = str.toUpperCase();
    const Flag = FlagIcons[code] ?? null;
    let label = code;
    try {
      label = regionNames?.of(code) || code;
    } catch {
      label = code;
    }
    return { code, label, Flag };
  }
  return { code: null, label: str, Flag: null };
}

function CountryYAxisTick({ x, y, payload, regionNames }) {
  const { label, Flag } = getCountryParts(payload?.value, regionNames);
  return (
    <g transform={`translate(${x},${y})`}>
      {Flag ? (
        <g transform="translate(-102, -7)">
          <Flag width={22} height={14} />
        </g>
      ) : null}
      <text x={-10} y={0} dy={4} textAnchor="end" fill="#888" fontSize={12}>
        {label}
      </text>
    </g>
  );
}

const StatCard = ({ title, value, icon: Icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <Card className="hover:border-primary/50 transition-colors">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
        </div>
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const Overview = () => {
  const [searchParams] = useSearchParams();
  const siteId = searchParams.get('siteId');
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    overview: null,
    browsers: [],
    countries: [],
    pages: [],
    activeVisitors: 0
  });

  useEffect(() => {
    if (!siteId) return;

    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const [overviewRes, browsersRes, countriesRes, pagesRes, activeRes] = await Promise.all([
          api.get(`/analytics/overview/${siteId}`),
          api.get(`/analytics/browsers/${siteId}`),
          api.get(`/analytics/countries/${siteId}`),
          api.get(`/analytics/pages/${siteId}`),
          api.get(`/analytics/active-visitors/${siteId}`)
        ]);

        setData({
          overview: overviewRes.data.analytics,
          browsers: browsersRes.data.browsers || [],
          countries: countriesRes.data.countries || [],
          pages: pagesRes.data.pages || [],
          activeVisitors: activeRes.data.activeVisitors || 0
        });
      } catch (error) {
        toast.error('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [siteId]);

  if (!siteId) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Activity className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
        <h2 className="text-2xl font-bold mb-2">No Site Selected</h2>
        <p className="text-muted-foreground">Please select a site from the My Sites page to view analytics.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const formatDuration = (seconds) => {
    if (!seconds) return '0s';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  const { overview, browsers, countries, pages, activeVisitors } = data;

  const regionNames = useMemo(
    () => new Intl.DisplayNames(['en'], { type: 'region' }),
    []
  );

  // Transform data for charts
  const browserData = browsers.map(b => ({ name: b._id || 'Unknown', value: b.count }));
  const countryData = countries
    .map((c) => ({ rawId: c._id, views: c.count }))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Overview</h1>
        <p className="text-muted-foreground mt-2">Comprehensive view of your website traffic and user engagement.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Visitors" value={activeVisitors} icon={Activity} delay={0.1} />
        <StatCard title="Total Pageviews" value={overview?.totalPageviews || 0} icon={Eye} delay={0.2} />
        <StatCard title="Unique Visitors" value={overview?.uniqueVisitors || 0} icon={Users} delay={0.3} />
        <StatCard title="Avg. Visit Duration" value={formatDuration(overview?.avgDuration)} icon={Clock} delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Browser Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Monitor className="w-5 h-5" />
                Top Browsers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                {browserData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={browserData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {browserData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #333', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">No data</div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {browserData.map((b, i) => (
                  <div key={b.name} className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                    <span className="truncate">{b.name}</span>
                    <span className="ml-auto font-medium">{b.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Country Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="w-5 h-5" />
                Top Countries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {countryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={countryData} layout="vertical" margin={{ top: 5, right: 30, left: 12, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                      <XAxis type="number" stroke="#888" />
                      <YAxis
                        dataKey="rawId"
                        type="category"
                        width={148}
                        stroke="#888"
                        tick={(props) => (
                          <CountryYAxisTick {...props} regionNames={regionNames} />
                        )}
                        tickLine={false}
                        axisLine={{ stroke: '#444' }}
                      />
                      <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null;
                          const row = payload[0].payload;
                          const { label, Flag } = getCountryParts(row.rawId, regionNames);
                          return (
                            <div
                              style={{
                                backgroundColor: 'rgba(0,0,0,0.85)',
                                border: '1px solid #333',
                                borderRadius: 8,
                                padding: '8px 12px',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                              }}
                            >
                              {Flag ? <Flag width={24} height={16} /> : null}
                              <span>
                                {label}: <strong>{row.views}</strong>
                              </span>
                            </div>
                          );
                        }}
                      />
                      <Bar dataKey="views" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">No data</div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top Pages Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MousePointerClick className="w-5 h-5" />
              Top Pages
            </CardTitle>
            <CardDescription>Most visited URLs on your website</CardDescription>
          </CardHeader>
          <CardContent>
            {pages.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-secondary/30 rounded-lg">
                    <tr>
                      <th className="px-6 py-3 rounded-l-lg">URL Path</th>
                      <th className="px-6 py-3 text-right rounded-r-lg">Pageviews</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pages.map((page, i) => (
                      <tr key={page._id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                        <td className="px-6 py-4 font-medium truncate max-w-[300px]" title={page._id}>
                          {page._id}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold">
                          {page.views}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">No pageview data available yet.</div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Overview;
