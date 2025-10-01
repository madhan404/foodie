import React from "react";
import clsx from "clsx";

export function Badge({ className, children }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700",
        className
      )}
    >
      {children}
    </span>
  );
}
