"use client";

import * as Icons from "lucide-react";
import { LucideProps } from "lucide-react";

interface ClientIconProps extends LucideProps {
  name: keyof typeof Icons;
}

export function ClientIcon({ name, ...props }: ClientIconProps) {
  const Icon = Icons[name] as React.ElementType;
  if (!Icon) return null;
  return <Icon {...props} />;
}
