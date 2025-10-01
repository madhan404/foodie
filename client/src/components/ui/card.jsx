import React from "react";
import clsx from "clsx";

export function Card({ className, children }) {
  return (
    <div className={clsx("bg-white rounded-lg shadow-md overflow-hidden", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children }) {
  return (
    <h3 className={clsx("text-lg font-semibold", className)}>
      {children}
    </h3>
  );
}


export function CardHeader({ className, children }) {
  return (
    <div className={clsx("p-4 border-b", className)}>
      {children}
    </div>
  );
}

export function CardContent({ className, children }) {
  return (
    <div className={clsx("p-4", className)}>
      {children}
    </div>
  );
}
