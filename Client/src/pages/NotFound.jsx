import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-9xl font-extrabold text-primary/20 tracking-tighter mb-4">404</h1>
      <h2 className="text-3xl font-bold mb-4">Page not found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/">
        <Button size="lg">Go back home</Button>
      </Link>
    </div>
  );
};

export default NotFound;
