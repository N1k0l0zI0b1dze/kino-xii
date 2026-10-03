type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
};

const Modal = ({ children, onClose }: ModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-[#101010]/30 backdrop-blur-[10px]"
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default Modal;
