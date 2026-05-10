import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Globe, ExternalLink, BarChart2 } from 'lucide-react';
import api from '../../services/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const MySites = () => {
  const [sites, setSites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await api.get('/site/my-sites');
        if (response.data.success) {
          setSites(response.data.sites);
        }
      } catch (error) {
        toast.error('Failed to load sites');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSites();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Sites</h1>
          <p className="text-muted-foreground mt-2">Manage all your tracked websites in one place.</p>
        </div>
        <Link to="/dashboard/sites/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New Site
          </Button>
        </Link>
      </div>

      {sites.length === 0 ? (
        <Card className="text-center py-12 border-dashed">
          <CardContent>
            <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No sites tracked yet</h3>
            <p className="text-muted-foreground mb-6">Add your first site to start collecting analytics data.</p>
            <Link to="/dashboard/sites/create">
              <Button>Add Your First Site</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site, i) => (
            <motion.div
              key={site._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full flex flex-col hover:border-primary/50 transition-colors group">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{site.siteName}</span>
                    <Globe className="w-5 h-5 text-muted-foreground" />
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <a href={`https://${site.domain}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline truncate">
                      {site.domain}
                    </a>
                    <ExternalLink className="w-3 h-3" />
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-md break-all">
                    ID: {site.siteId}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to={`/dashboard/analytics?siteId=${site.siteId}`} className="w-full">
                    <Button variant="secondary" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <BarChart2 className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySites;
