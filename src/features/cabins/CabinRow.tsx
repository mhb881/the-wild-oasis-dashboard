import { Copy, Edit, EllipsisVertical, Trash2 } from "lucide-react";
import { useState } from "react";

import { formateCurrency } from "../../lib/utils/helpers";
import type { Cabin } from "../../types/types";
import {
  ConfirmDelete,
  MenuItem,
  MenuList,
  Menus,
  MenuToggle,
  Modal,
  TableRow,
} from "../../ui";
import CreateCabinForm from "./CreateCabinForm";
import useDeleteCabin from "./useDeleteCabin";

function CabinRow({ cabin }: { cabin: Cabin }) {
  const [isLoaded, setIsLoaded] = useState(false);

  const { isDeleting, delCabinMutate } = useDeleteCabin();

  const {
    id: cabinId,
    name,
    maxCapacity,
    regularPrice,
    discount,
    image,
  } = cabin;

  return (
    <>
      <TableRow>
        <td className="text-center">
          <div className="relative block aspect-3/2 w-[6.4rem] scale-110 overflow-hidden rounded-xl bg-gray-200">
            <img
              src={image || undefined}
              className={`h-full w-full object-cover object-center transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
              alt={`Cabin ${name}`}
              loading="lazy"
              onLoad={() => setIsLoaded(true)}
              onError={() => setIsLoaded(true)}
            />
            {/* skeleton 优化用户体验 */}
            {!isLoaded && (
              <div className="animate-shimmer absolute inset-0 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 bg-size-[200%_100%]" />
            )}
          </div>
        </td>

        <td className="font-['Sono'] text-base font-semibold text-gray-600">
          {name}
        </td>

        <td className="font-['Sono'] text-base font-semibold text-gray-600">
          Fits up to {maxCapacity} guests
        </td>

        <td className="font-['Sono'] text-base font-semibold text-gray-600">
          {formateCurrency(regularPrice)}
        </td>

        <td className="font-['Sono'] text-base font-semibold text-green-500">
          {discount ? formateCurrency(discount) : <span>&mdash;</span>}
        </td>

        <td className="flex items-center gap-3">
          <Modal>
            <Menus>
              <MenuToggle>
                <EllipsisVertical size={18} />
              </MenuToggle>
              <MenuList>
                <Modal.Trigger name="copy" asChild>
                  <MenuItem icon={<Copy size={16} />}>复制</MenuItem>
                </Modal.Trigger>

                <Modal.Trigger name="edit" asChild>
                  <MenuItem icon={<Edit size={16} />}>编辑</MenuItem>
                </Modal.Trigger>

                <Modal.Trigger name="delete" asChild>
                  <MenuItem icon={<Trash2 size={16} />}>删除</MenuItem>
                </Modal.Trigger>
              </MenuList>
            </Menus>

            <Modal.Content name="copy">
              <CreateCabinForm cabinToCopy={cabin} />
            </Modal.Content>

            <Modal.Content name="edit">
              <CreateCabinForm cabinToEdit={cabin} />
            </Modal.Content>

            <Modal.Content name="delete">
              <ConfirmDelete
                resourceName={name}
                onConfirm={() => {
                  if (!cabinId) return;
                  delCabinMutate(cabinId);
                }}
                disabled={isDeleting}
              />
            </Modal.Content>
          </Modal>
        </td>
      </TableRow>
    </>
  );
}

export default CabinRow;
