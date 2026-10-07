import { Button, Modal } from "../../ui";
import CreateCabinForm from "./CreateCabinForm";

function AddCabin() {
  return (
    <div>
      <Modal>
        <Modal.Trigger asChild>
          <Button variant="primary" className="w-full max-w-40">
            添加小屋
          </Button>
        </Modal.Trigger>
        <Modal.Content>
          <CreateCabinForm />
        </Modal.Content>
      </Modal>
    </div>
  );
}

export default AddCabin;
