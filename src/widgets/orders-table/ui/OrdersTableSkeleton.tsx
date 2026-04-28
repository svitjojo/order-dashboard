export function OrdersTableSkeleton() {
  return (
    <table className="w-full animate-pulse text-sm">
      <thead className="border-b border-border bg-muted/50">
        <tr>
          <th className="px-4 py-2.5" />
          <th className="px-4 py-2.5" />
          <th className="px-4 py-2.5" />
          <th className="px-4 py-2.5" />
          <th className="px-4 py-2.5" />
          <th className="px-4 py-2.5" />
          <th className="px-4 py-2.5" />
          <th className="px-2 py-2.5" />
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {Array.from({ length: 8 }, (_, rowIndex) => (
          <tr key={rowIndex}>
            <td className="px-4 py-3">
              <div className="h-4 w-28 rounded bg-muted" />
            </td>
            <td className="px-4 py-3">
              <div className="h-5 w-20 rounded-full bg-muted" />
            </td>
            <td className="px-4 py-3">
              <div className="h-4 w-48 rounded bg-muted" />
            </td>
            <td className="px-4 py-3">
              <div className="h-4 w-32 rounded bg-muted" />
            </td>
            <td className="px-4 py-3">
              <div className="h-4 w-20 rounded bg-muted" />
            </td>
            <td className="px-4 py-3">
              <div className="h-4 w-24 rounded bg-muted" />
            </td>
            <td className="px-4 py-3">
              <div className="ml-auto h-4 w-16 rounded bg-muted" />
            </td>
            <td className="px-2 py-3">
              <div className="h-8 w-8 rounded bg-muted" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
