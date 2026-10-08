import { UserPlus } from "lucide-react";

import { Button, Modal } from "../../ui";
import CreateUserForm from "./CreateUserForm";

export function AddUser() {
  return (
    <div>
      <Modal>
        <Modal.Trigger asChild>
          <Button variant="primary" className="flex items-center gap-2">
            <UserPlus size={18} />
            <span>添加新用户</span>
          </Button>
        </Modal.Trigger>
        <Modal.Content>
          <CreateUserForm />
        </Modal.Content>
      </Modal>
    </div>
  );
}

export default AddUser;
