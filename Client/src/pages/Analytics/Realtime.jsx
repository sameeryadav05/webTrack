import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Activity, Zap, Users } from 'lucide-react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { motion } from 'framer-motion';

const Realtime = () => {
  const [searchParams] = useSearchParams();
  const siteId = searchParams.get('siteId');
  const [activeVisitors, setActiveVisitors] = useState(0);
  const [events, setEvents] = useState([]);
  
  // Polling for active visitors
  useEffect(() => {
    if (!siteId) return;

    const fetchActive = async () => {
      try {
        const response = await api.get(`/analytics/active-visitors/${siteId}`);
        setActiveVisitors(response.data.activeVisitors || 0);
      } catch (error) {
        console.error("Failed to fetch active visitors");
      }
    };

    fetchActive();
    const interval = setInterval(fetchActive, 5000); // Poll every 5 seconds
    
    return () => clearInterval(interval);
  }, [siteId]);

  if (!siteId) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Activity className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
        <h2 className="text-2xl font-bold mb-2">No Site Selected</h2>
        <p className="text-muted-foreground">Please select a site from the My Sites page to view real-time data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-8 h-8 bg-green-500 rounded-full animate-ping opacity-20"></div>
          <div className="w-4 h-4 bg-green-500 rounded-full z-10 shadow-[0_0_15px_rgba(34,197,94,0.6)]"></div>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Realtime Pulse</h1>
          <p className="text-muted-foreground mt-1">Live overview of your website traffic.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-primary/50 shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)] glass-panel relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full relative z-10">
            <Users className="w-12 h-12 text-primary mb-4 opacity-80" />
            <motion.div
              key={activeVisitors}
              initial={{ scale: 1.5, color: '#3b82f6' }}
              animate={{ scale: 1, color: 'inherit' }}
              className="text-7xl font-black tracking-tighter tabular-nums text-foreground mb-2"
            >
              {activeVisitors}
            </motion.div>
            <p className="text-lg font-medium text-muted-foreground uppercase tracking-widest">Active Visitors Right Now</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 flex flex-col items-center justify-center py-12 text-center glass-panel">
            <Zap className="w-16 h-16 text-yellow-500 mb-4 opacity-50" />
            <h3 className="text-2xl font-semibold mb-2">Event Stream Connected</h3>
            <p className="text-muted-foreground max-w-md">
              The real-time infrastructure is running and aggregating data via Redis. Active visitor counts update every few seconds based on live traffic.
            </p>
        </Card>
      </div>
    </div>
  );
};

export default Realtime;
