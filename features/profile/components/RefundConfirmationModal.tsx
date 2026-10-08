import Modal from "@/components/ui/Modal";

type RefundConfirmationModalProps = {
  isPending: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

const RefundConfirmationModal = ({
  isPending,
  onConfirm,
  onClose,
}: RefundConfirmationModalProps) => {
  return (
    <Modal onClose={onClose}>
      <div className="w-105 rounded-3xl bg-[#080D1D] p-8 text-white">
        <h2 className="text-xl font-bold">Refund tickets?</h2>

        <p className="mt-3 text-sm leading-6 text-white/60">
          Are you sure you want to refund this order? This action cannot be
          undone.
        </p>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="cursor-pointer rounded-full bg-[#1E2031] px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="cursor-pointer rounded-full bg-[#EC3013] px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Refunding..." : "Confirm refund"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RefundConfirmationModal;
