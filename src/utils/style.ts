export function getCssCustomVariable(element: HTMLElement | ShadowRoot, variable: string, defaultValue = ''): string {
  const el = (element.getRootNode() instanceof ShadowRoot ? element.firstElementChild : element) as HTMLElement;
  const value = window.getComputedStyle(el).getPropertyValue(`--${variable}`);
  return value || defaultValue;
}
