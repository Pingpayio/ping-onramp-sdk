
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-ping-50 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <img 
          src="/lovable-uploads/a984f844-0031-4fc1-8792-d810f6bbd335.png" 
          alt="Ping Logo" 
          className="h-16 mb-6 mx-auto" 
        />
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Oops! The page you're looking for doesn't exist.</p>
        <Link to="/">
          <Button variant="gradient" size="lg" icon={<Home className="h-5 w-5" />}>
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
