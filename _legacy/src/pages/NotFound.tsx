import React from "react";
import { Link } from "react-router-dom";
import Button from "@/components/Button";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="h-screen bg-gradient-to-b from-white to-ping-50 flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="text-center">
        <img
          src="/lovable-uploads/a984f844-0031-4fc1-8792-d810f6bbd335.png"
          alt="Ping Logo"
          className="h-12 mb-4 mx-auto"
        />
        <h1 className="text-3xl font-bold mb-2">404</h1>
        <p className="text-lg text-muted-foreground mb-4">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link to="/">
          <Button
            variant="gradient"
            size="lg"
            icon={<Home className="h-5 w-5" />}
          >
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
