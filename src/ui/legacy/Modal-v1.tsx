import { X } from "lucide-react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  children: ReactNode;
  onClose?: () => void;
}

interface OverlayProps {
  onClose?: () => void;
}

const Modal = ({ children, onClose }: ModalProps) => {
  return createPortal(
    // 1. 修复 z-10flex 拼写错误；升级 z-index 确保模态框在最上层
    // 2. 增加 p-4 确保在手机端时，模态框不会紧贴屏幕边缘
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      {/* 1. 先写 Overlay：它先被渲染，呆在最底层 */}
      <Overlay onClose={onClose} />

      {/* 模态框主体：由父级 flex 完美居中，不再需要 top-1/2 和 transform 偏移 */}
      {/* 2. 后写内容卡片：它后被渲染，自然而然地盖在 Overlay 的上方 */}
      <div className="relative w-full max-w-[64rem] overflow-hidden rounded-xl bg-white p-10 shadow-2xl transition-all">
        {onClose && (
          <button
            className="absolute top-4 right-4 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
            onClick={onClose}
            aria-label="Close"
          >
            {/* 替换为更现代、细腻的 SVG 关闭图标 */}
            <X />
          </button>
        )}

        {/* 内容容器 */}
        <div className="">{children}</div>
      </div>
    </div>,
    document.body,
  );
};

const Overlay = ({ onClose }: OverlayProps) => {
  return (
    // 1. 用 fixed inset-0 替代复杂的 top-0 left-0 w-full h-screen
    // 2. 纯 blur 在亮色背景下不明显，加入带透明度的深色底（bg-slate-900/40）会更有景深感
    <div
      className="fixed inset-0 bg-slate-600/40 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    />
  );
};

export { Modal, Overlay };
