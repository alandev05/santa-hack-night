import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getSentimentColor(sentiment: string): string {
  switch (sentiment?.toLowerCase()) {
    case 'positive':
      return 'bg-accent text-foreground border-border';
    case 'negative':
    case 'needs support':
      return 'bg-accent text-foreground border-border';
    case 'neutral':
      return 'bg-muted text-muted-foreground border-border';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
}

export function getStatusColor(status: string): string {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'bg-accent text-foreground border-border';
    case 'follow-up scheduled':
      return 'bg-accent text-foreground border-border';
    case 'pending':
      return 'bg-muted text-muted-foreground border-border';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
}
