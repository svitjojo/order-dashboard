import { useNavigate } from 'react-router-dom';
import { PlusIcon, XIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { setActiveTab, createDraft, closeDraft } from '@/features/draft-management/model/draftsSlice';
import { MAX_DRAFT_TABS } from '@/shared/config/constants';

export function DraftsBar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { drafts } = useAppSelector((state) => state.drafts);

  if (drafts.length === 0) return null;

  const atLimit = drafts.length >= MAX_DRAFT_TABS;

  const handleChipClick = (id: string) => {
    dispatch(setActiveTab(id));
    navigate('/orders/new');
  };

  const handleNewDraft = () => {
    dispatch(createDraft());
    navigate('/orders/new');
  };

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground">Drafts:</span>
      {drafts.map((draft) => (
        <div
          key={draft.id}
          className="inline-flex items-center rounded-full border border-border bg-muted/50 text-xs font-medium transition-colors hover:bg-muted"
        >
          <button
            type="button"
            onClick={() => handleChipClick(draft.id)}
            className="cursor-pointer pl-3 pr-1.5 py-1"
          >
            {draft.title}
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); dispatch(closeDraft(draft.id)); }}
            className="cursor-pointer rounded-r-full pr-2 py-1 opacity-50 hover:opacity-100"
            aria-label={`Discard ${draft.title}`}
          >
            <XIcon className="size-3" />
          </button>
        </div>
      ))}
      {!atLimit && (
        <button
          type="button"
          onClick={handleNewDraft}
          className="cursor-pointer inline-flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-border hover:text-foreground"
        >
          <PlusIcon className="size-3" />
          New Draft
        </button>
      )}
    </div>
  );
}
