import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Frown } from "lucide-react";

interface NoContentFoundProps {
  message: string;
  linkTo?: string;
  linkText?: string;
  className?: string;
}

const NoContentFound: React.FC<NoContentFoundProps> = ({ message, linkTo, linkText, className }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center text-muted-foreground ${className}`}>
      <Frown className="h-12 w-12 mb-4" />
      <p className="text-lg mb-4">{message}</p>
      {linkTo && linkText && (
        <Link to={linkTo}>
          <Button>{linkText}</Button>
        </Link>
      )}
    </div>
  );
};

export default NoContentFound;