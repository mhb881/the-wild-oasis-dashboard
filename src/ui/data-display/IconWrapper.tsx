import type { LucideProps } from "lucide-react";

import { cn } from "../../lib/utils/cn";

interface IconWrapperProps extends LucideProps {
    isActive: boolean;
}

export default function IconWrapper({ children, isActive, className }: IconWrapperProps) {
    return (
        <span className={cn(className)}>
            {children}
        </span>
    );
}
