import { useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, ArrowLeftIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  createDraft,
  closeDraft,
  setActiveTab,
  updateDraft,
} from '@/features/draft-management/model/draftsSlice';
import { useCreateOrderMutation } from '@/entities/order/api/orderApi';
import { Button } from '@/shared/ui/button';
import { MAX_DRAFT_TABS } from '@/shared/config/constants';
import type { CreateOrderInput } from '@/entities/order/model/schemas';
import type { CreateOrderFormData } from '@/entities/order/model/types';
import { useOrderForm } from '../model/useOrderForm';
import { DraftTabsBar } from './DraftTabsBar';
import { ClientSection } from './ClientSection';
import { OrderSection } from './OrderSection';
import { StopsSection } from './StopsSection';

const CLEARED_FORM_DATA: Partial<CreateOrderFormData> = {
  clientName: '',
  referenceNumber: '',
  carrierId: '',
  notes: '',
  stops: [
    {
      type: 'pick_up',
      locationName: '',
      address: { city: '', state: '', zip: '' },
      refNumber: '',
      appointmentType: 'fcfs',
      appointmentDate: '',
      notes: '',
    },
    {
      type: 'drop_off',
      locationName: '',
      address: { city: '', state: '', zip: '' },
      refNumber: '',
      appointmentType: 'fcfs',
      appointmentDate: '',
      notes: '',
    },
  ],
};

export function OrderForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { drafts, activeTabId } = useAppSelector((state) => state.drafts);
  const { form, handleFormBlur, draftSavedVisible } = useOrderForm();
  const [createOrder, { isLoading: isSubmitting }] = useCreateOrderMutation();

  const isAtMaxDrafts = drafts.length >= MAX_DRAFT_TABS;

  useEffect(() => {
    if (drafts.length === 0) {
      dispatch(createDraft());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = (newTabId: string) => {
    if (activeTabId && activeTabId !== newTabId) {
      dispatch(
        updateDraft({
          id: activeTabId,
          formData: form.getValues() as Partial<CreateOrderFormData>,
        }),
      );
    }
    dispatch(setActiveTab(newTabId));
  };

  const handleNewDraft = () => {
    if (activeTabId) {
      dispatch(
        updateDraft({
          id: activeTabId,
          formData: form.getValues() as Partial<CreateOrderFormData>,
        }),
      );
    }
    dispatch(createDraft());
  };

  const handleClearAll = () => {
    if (!activeTabId) return;
    form.reset(CLEARED_FORM_DATA as Partial<CreateOrderInput>);
    dispatch(updateDraft({ id: activeTabId, formData: CLEARED_FORM_DATA }));
  };

  const handleDeleteDraft = () => {
    if (!activeTabId) return;
    const willBeEmpty = drafts.length <= 1;
    dispatch(closeDraft(activeTabId));
    if (willBeEmpty) navigate('/orders');
  };

  const handleValidSubmit = async (validData: CreateOrderInput) => {
    try {
      await createOrder(validData).unwrap();
      if (activeTabId) dispatch(closeDraft(activeTabId));
      toast.success('Order created');
      navigate('/orders');
    } catch {
      toast.error('Failed to create order');
    }
  };

  const handleInvalidSubmit = () => {
    const firstInvalidElement = document.querySelector('[aria-invalid="true"]');
    firstInvalidElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  if (!activeTabId) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">Loading...</div>
    );
  }

  return (
    <FormProvider {...form}>
      <form
        onBlur={handleFormBlur}
        onSubmit={form.handleSubmit(handleValidSubmit, handleInvalidSubmit)}
        className="flex min-h-screen flex-col"
        noValidate
      >
        {/* Workspace header */}
        <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-border bg-background px-4 py-2.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigate('/orders')}
            className="-ml-2"
          >
            <ArrowLeftIcon className="mr-1 h-4 w-4" />
            Orders
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold text-foreground">New Order</h1>
            <span
              aria-live="polite"
              className={`text-xs font-medium text-muted-foreground transition-opacity duration-200 ${
                draftSavedVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              DRAFT SAVED
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleNewDraft}
              disabled={isAtMaxDrafts}
            >
              <PlusIcon />
              New Tab
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={handleClearAll}>
              Clear All
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={handleDeleteDraft}>
              Delete Draft
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Draft'}
            </Button>
          </div>
        </div>

        {/* Tab bar */}
        <DraftTabsBar onTabChange={handleTabChange} />

        {/* Form sections */}
        <div className="space-y-8 p-6">
          <ClientSection />
          <OrderSection />
          <StopsSection />
        </div>
      </form>
    </FormProvider>
  );
}
