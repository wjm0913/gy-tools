
/**
 * 监听 dom 大小、位置改变
 * @param dom
 * @param onChanged
 * @returns
 */
export const onDomSizeChanged = (
  dom: HTMLElement,
  onChanged: (x: number, y: number, width: number, height: number) => void,
) => {
  // 使用 ResizeObserver 监听大小变化
  const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      const { width, height } = entry.contentRect
      const { left, top } = dom.getBoundingClientRect()
      // console.log(dom.offsetLeft, dom.offsetTop, left, top, width, height)
      onChanged(Math.trunc(left), Math.trunc(top), Math.trunc(width), Math.trunc(height))
    }
  })

  resizeObserver.observe(dom)

  // 初始化时调用一次
  const initialRect = dom.getBoundingClientRect()
  onChanged(initialRect.left, initialRect.top, initialRect.width, initialRect.height)

  return () => {
    resizeObserver.disconnect()
  }
}
