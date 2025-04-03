
import React from 'react';
import { Link } from 'react-router-dom';

const OnrampHeader = () => {
  return (
    <header className="flex justify-between items-center mb-2">
      <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
        <img 
          src="/lovable-uploads/a984f844-0031-4fc1-8792-d810f6bbd335.png" 
          alt="Ping Logo" 
          className="h-7 md:h-8" 
        />
      </Link>
    </header>
  );
};

export default OnrampHeader;
