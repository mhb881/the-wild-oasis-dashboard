import { createContext, useContext } from "react";

export interface ModalContextValue {
  /** 当前激活的 Modal 唯一名称，空字符串代表全部关闭 */
  activeName: string;
  /** 检查当前（或指定名称的）Modal 是否处于开启状态 */
  isOpen: (name?: string) => boolean;
  /** 打开指定名称（或默认）的 Modal */
  open: (name?: string) => void;
  /** 关闭当前激活的 Modal */
  close: () => void;
  titleId?: string;
  descriptionId?: string;
  setTitleId: (id: string) => void;
  setDescriptionId: (id: string) => void;
}

export const ModalContext = createContext<ModalContextValue | null>(null);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal 必须在 <Modal> 组件内部使用");
  }
  return context;
}

export function useOptionalModal() {
  return useContext(ModalContext);
}
