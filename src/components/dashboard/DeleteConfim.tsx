interface DeleteConfirmProps {
  onConfirm: () => void;
  onCancel: () => void;
}
const DeleteConfirm: React.FC<DeleteConfirmProps> = ({
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-[var(--kek)] opacity-75 bg-opacity-50 flex justify-center items-center">
      <div className="bg-[var(--background)] p-8 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Biztos benne?</h2>
        <div className="flex justify-between">
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white py-2 px-4 rounded"
          >
            Igen
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 text-black py-2 px-4 rounded"
          >
            Mégse
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirm;
