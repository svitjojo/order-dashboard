import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { updateDraft } from '@/features/draft-management/model/draftsSlice';
import { createOrderSchema, type CreateOrderInput } from '@/entities/order/model/schemas';
import type { CreateOrderFormData, LocalDraft } from '@/entities/order/model/types';

const DEFAULT_PICK_UP_STOP: CreateOrderInput['stops'][number] = {
  type: 'pick_up',
  address: { city: '', state: '', zip: '' },
  appointmentType: 'fcfs',
};

const DEFAULT_DROP_OFF_STOP: CreateOrderInput['stops'][number] = {
  type: 'drop_off',
  address: { city: '', state: '', zip: '' },
  appointmentType: 'fcfs',
};

function buildDefaultValues(formData: Partial<CreateOrderFormData>): Partial<CreateOrderInput> {
  const rawStops =
    formData.stops && formData.stops.length >= 2
      ? formData.stops
      : [DEFAULT_PICK_UP_STOP, DEFAULT_DROP_OFF_STOP];

  return {
    clientName: formData.clientName ?? '',
    referenceNumber: formData.referenceNumber ?? '',
    carrierId: formData.carrierId ?? '',
    equipmentType: formData.equipmentType,
    loadType: formData.loadType,
    rate: formData.rate,
    weight: formData.weight,
    notes: formData.notes ?? '',
    stops: rawStops.map((stop) => ({
      type: stop.type,
      locationName: stop.locationName ?? '',
      refNumber: stop.refNumber ?? '',
      address: {
        city: stop.address?.city ?? '',
        state: stop.address?.state ?? '',
        zip: stop.address?.zip ?? '',
      },
      appointmentType: stop.appointmentType ?? 'fcfs',
      appointmentDate: stop.appointmentDate ?? '',
      notes: stop.notes ?? '',
    })),
  };
}

export function getFormDefaultValues(draft: LocalDraft | undefined): Partial<CreateOrderInput> {
  return buildDefaultValues(draft?.formData ?? {});
}

export function useOrderForm() {
  const dispatch = useAppDispatch();
  const { drafts, activeTabId } = useAppSelector((state) => state.drafts);
  const activeDraft = drafts.find((draft) => draft.id === activeTabId);

  const [draftSavedVisible, setDraftSavedVisible] = useState(false);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draftsRef = useRef(drafts);
  draftsRef.current = drafts;

  const form = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: buildDefaultValues(activeDraft?.formData ?? {}),
    reValidateMode: 'onChange',
    mode: 'onSubmit',
  });

  // Reset form whenever the active tab changes
  useEffect(() => {
    const newActiveDraft = draftsRef.current.find((draft) => draft.id === activeTabId);
    form.reset(buildDefaultValues(newActiveDraft?.formData ?? {}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTabId]);

  const triggerDraftSavedIndicator = useCallback(() => {
    setDraftSavedVisible(true);
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    savedTimerRef.current = setTimeout(() => setDraftSavedVisible(false), 2000);
  }, []);

  const handleFormBlur = useCallback(() => {
    if (!activeTabId) return;
    dispatch(
      updateDraft({
        id: activeTabId,
        formData: form.getValues() as Partial<CreateOrderFormData>,
      }),
    );
    triggerDraftSavedIndicator();
  }, [activeTabId, dispatch, form, triggerDraftSavedIndicator]);

  return { form, handleFormBlur, draftSavedVisible };
}
