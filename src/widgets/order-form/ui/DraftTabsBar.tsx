import { XIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { closeDraft } from '@/features/draft-management/model/draftsSlice';
import { cn } from '@/shared/lib/utils';

interface DraftTabsBarProps {
  onTabChange: (tabId: string) => void;
}

export function DraftTabsBar({ onTabChange }: DraftTabsBarProps) {
  const dispatch = useAppDispatch();
  const { drafts, activeTabId } = useAppSelector((state) => state.drafts);

  const isOneTab = drafts.length === 1;

  const handleCloseTab = (event: React.MouseEvent, draftId: string) => {
    event.stopPropagation();
    dispatch(closeDraft(draftId));
  };

  return (
    <div
      role="tablist"
      className="flex items-center overflow-x-auto border-b border-border bg-muted/30 px-1"
    >
      {drafts.map((draft) => (
        <div
          key={draft.id}
          role="tab"
          aria-selected={activeTabId === draft.id}
          tabIndex={0}
          onClick={() => onTabChange(draft.id)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') onTabChange(draft.id);
          }}
          className={cn(
            'group flex min-w-0 max-w-48 shrink-0 cursor-pointer items-center gap-1 border-b-2 px-3 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            activeTabId === draft.id
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          <span className="truncate">{draft.title}</span>
          {!isOneTab && (
            <button
              type="button"
              onClick={(event) => handleCloseTab(event, draft.id)}
              className="ml-0.5 shrink-0 rounded-sm p-0.5 opacity-50 transition-opacity hover:opacity-100 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
              aria-label={`Close ${draft.title}`}
            >
              <XIcon className="size-3" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
