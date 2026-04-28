const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const relativeFormatter = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '—';
  return dateFormatter.format(new Date(date));
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '—';
  return dateTimeFormatter.format(new Date(date));
}

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

export function formatRelativeTime(date: string | Date): string {
  const diff = (new Date(date).getTime() - Date.now()) / 1000;
  const abs = Math.abs(diff);

  if (abs < 60) return relativeFormatter.format(Math.round(diff), 'second');
  if (abs < 3600) return relativeFormatter.format(Math.round(diff / 60), 'minute');
  if (abs < 86400) return relativeFormatter.format(Math.round(diff / 3600), 'hour');
  return relativeFormatter.format(Math.round(diff / 86400), 'day');
}
