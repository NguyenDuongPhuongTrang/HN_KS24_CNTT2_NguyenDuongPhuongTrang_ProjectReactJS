import Button from "./Button";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  projectName?: string;
  taskName?: string;
}

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, projectName }: ConfirmDeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[550px]">
        <div className="flex justify-between items-center border-b pb-4 mb-8">
          <h2 className="text-2xl font-medium">Xác nhận xóa</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        <p className="mb-8">
          Bạn chắc chắn muốn xóa <span className="font-semibold">{projectName}</span>?
        </p>
        <hr />
        <div className="flex justify-end gap-2 mt-4">
          <Button text="Hủy" className="bg-gray-400 text-white" onClick={onClose} />
          <Button text="Xóa" className="bg-red-600 hover:bg-red-700 text-white" onClick={onConfirm} />
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;