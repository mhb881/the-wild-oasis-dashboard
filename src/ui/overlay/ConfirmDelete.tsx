import Button from "../buttons/Button";
import ButtonGroup from "../buttons/ButtonGroup";
import Heading from "../data-display/Heading";
import { useOptionalModal } from "./ModalContext";

interface ConfirmDeleteProps {
  resourceName: string;
  onConfirm?: () => void;
  disabled?: boolean;
  onClose?: () => void;
}

const ConfirmDelete = ({
  resourceName,
  onConfirm,
  disabled,
  onClose,
}: ConfirmDeleteProps) => {
  const modal = useOptionalModal();
  const handleClose = onClose ?? modal?.close;

  return (
    <div className="flex w-[40rem] flex-col gap-3">
      <Heading>
        确认删除 <span className="font-extrabold">{resourceName}</span>
      </Heading>
      <p className="mb-3 text-gray-500">
        你确定要永久删除 <span className="font-extrabold">{resourceName}</span>{" "}
        吗？这是一个不可逆的操作。
      </p>

      <ButtonGroup className="flex justify-end gap-3">
        <Button variant="secondary" disabled={disabled} onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" disabled={disabled} onClick={onConfirm}>
          Delete
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default ConfirmDelete;
