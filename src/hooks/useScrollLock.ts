import { useEffect } from "react";

// ---- 3. 自定义滚动锁 Hook ----
export default function useScrollLock(
  isLocked: boolean,
  selector = "[data-modal-content], [data-menu-content]",
) {
  useEffect(() => {
    if (!isLocked) return;

    // 1. 锁定背景页面滚动并记录原本 overflow 样式
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // 2. 阻止事件穿透 (移动端 touchmove 与桌面端 wheel)
    function handlePreventScroll(e: TouchEvent | WheelEvent) {
      const target = e.target as Element | null;
      const allowedContent = target?.closest?.(selector) as HTMLElement | null;

      // 若滑动发生在目标内容区域外部（如背景页面），阻止默认滑动行为
      if (!allowedContent) {
        e.preventDefault();
        return;
      }

      // 若在目标内容内部，向上寻找可滚动容器
      let current: Element | null = target;
      let canScroll = false;
      while (current && current !== document.body) {
        const style = window.getComputedStyle(current);
        const hasScrollOverflow =
          style.overflowY === "auto" ||
          style.overflowY === "scroll" ||
          style.overflowX === "auto" ||
          style.overflowX === "scroll";

        if (
          hasScrollOverflow &&
          (current.scrollHeight > current.clientHeight ||
            current.scrollWidth > current.clientWidth)
        ) {
          canScroll = true;
          break;
        }

        if (current === allowedContent) break;
        current = current.parentElement;
      }

      // 内部不可滚动时阻止滑动，防止滚动穿透到底层页面
      if (!canScroll) {
        e.preventDefault();
      }
    }

    document.addEventListener("touchmove", handlePreventScroll, {
      passive: false,
    });
    document.addEventListener("wheel", handlePreventScroll, {
      passive: false,
    });

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("touchmove", handlePreventScroll);
      document.removeEventListener("wheel", handlePreventScroll);
    };
  }, [isLocked, selector]);
}
