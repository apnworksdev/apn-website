const COLUMN_MQ = "(max-width: 1250px)";
const EPSILON = 2;
const mq = window.matchMedia(COLUMN_MQ);

type Teardown = () => void;
let teardown: Teardown | null = null;

function isColumnMode(): boolean {
  return mq.matches;
}

function itemsOf(block: HTMLElement): HTMLElement[] {
  return Array.from(
    block.querySelectorAll<HTMLElement>(
      ":scope > .case-study__item, :scope > .case-study__cols > .case-study__col > .case-study__item",
    ),
  );
}

function tokenGap(): number {
  const value = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--gap"));
  return Number.isFinite(value) ? value : 12;
}

function colGap(col: HTMLElement): number {
  const gap = parseFloat(getComputedStyle(col).rowGap || getComputedStyle(col).gap);
  return Number.isFinite(gap) ? gap : tokenGap();
}

function isInnerMedia(item: HTMLElement): boolean {
  return item.dataset.type === "media" && Boolean(item.querySelector("[data-fit='inner']"));
}

function isFlowItem(item: HTMLElement): boolean {
  return item.dataset.split === "true" || item.dataset.type === "text-media";
}

function lineHeightOf(el: HTMLElement): number {
  const text = el.querySelector(".case-study__text") ?? el;
  const lh = parseFloat(getComputedStyle(text).lineHeight);
  return lh > 0 ? lh : 16;
}

function snapDown(value: number, unit: number): number {
  if (unit <= 0) return value;
  return Math.max(unit, Math.floor((value + 0.01) / unit) * unit);
}

function snapUp(value: number, unit: number): number {
  if (unit <= 0) return value;
  return Math.max(unit, Math.ceil((value - 0.01) / unit) * unit);
}

function clearContinuation(block: HTMLElement): void {
  for (const node of block.querySelectorAll("[data-flow-clone]")) node.remove();
  for (const item of itemsOf(block)) {
    item.style.maxHeight = "";
    item.style.overflow = "";
  }
}

function aspectOf(figure: HTMLElement): number {
  const fromData = parseFloat(figure.dataset.aspect || "");
  if (fromData > 0) return fromData;
  const img = figure.querySelector("img");
  if (img && img.naturalWidth > 0 && img.naturalHeight > 0) {
    return img.naturalWidth / img.naturalHeight;
  }
  const video = figure.querySelector("video");
  if (video && video.videoWidth > 0 && video.videoHeight > 0) {
    return video.videoWidth / video.videoHeight;
  }
  return 0;
}

function resetOuters(block: HTMLElement): void {
  for (const figure of block.querySelectorAll<HTMLElement>("[data-fit='outer']")) {
    figure.style.width = "";
    figure.style.height = "";
    figure.style.marginLeft = "";
    figure.style.removeProperty("--outer-overflow");
    figure.classList.remove("case-study__figure--outer-bleed");
    const media = figure.querySelector<HTMLElement>(".case-study__media-element");
    if (media) {
      media.style.width = "";
      media.style.height = "";
    }
  }
}

function ensureCols(block: HTMLElement): [HTMLElement, HTMLElement] | null {
  let wrap = block.querySelector<HTMLElement>(":scope > .case-study__cols");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "case-study__cols";
    wrap.innerHTML =
      '<div class="case-study__col" data-col="0"></div><div class="case-study__col" data-col="1"></div>';
    block.append(wrap);
  }
  const col0 = wrap.querySelector<HTMLElement>("[data-col='0']");
  const col1 = wrap.querySelector<HTMLElement>("[data-col='1']");
  if (!col0 || !col1) return null;
  return [col0, col1];
}

function dismantleCols(block: HTMLElement): void {
  const wrap = block.querySelector<HTMLElement>(":scope > .case-study__cols");
  if (!wrap) return;
  const ordered = itemsOf(block);
  for (const item of ordered) block.insertBefore(item, wrap);
  wrap.remove();
}

function sizeOuter(figure: HTMLElement, nextHeight: number, maxWidth: number, col?: HTMLElement): void {
  const ratio = aspectOf(figure);
  if (ratio <= 0 || nextHeight <= 0 || maxWidth <= 0) return;
  let height = nextHeight;
  let width = height * ratio;
  if (width > maxWidth) {
    width = maxWidth;
    height = width / ratio;
  }
  const roundedWidth = Math.round(width);
  const roundedHeight = Math.round(height);
  const media = figure.querySelector<HTMLElement>(".case-study__media-element");

  figure.style.width = `${roundedWidth}px`;
  figure.style.height = "";
  if (media) {
    media.style.width = `${roundedWidth}px`;
    media.style.height = `${roundedHeight}px`;
  }

  const colWidth = col?.clientWidth ?? 0;
  const overflow = colWidth > 0 ? roundedWidth - colWidth : 0;
  figure.classList.toggle("case-study__figure--outer-bleed", overflow > 0);
  figure.style.setProperty("--outer-overflow", `${Math.max(overflow, 0)}px`);
  figure.style.marginLeft =
    col?.dataset.col === "0" && overflow > 0 ? `${-overflow}px` : "";
}

function outwardMax(block: HTMLElement, col: HTMLElement): number {
  const modules = block.closest(".case-study__modules");
  const colWidth = col.clientWidth;
  if (!(modules instanceof HTMLElement) || colWidth <= 0) {
    return Math.max(block.clientWidth, colWidth);
  }
  return colWidth + Math.max(0, (modules.clientWidth - block.clientWidth) / 2);
}

function leftoverMax(block: HTMLElement, col: HTMLElement): number {
  const container = block.closest(".case-study__container");
  const colWidth = col.clientWidth;
  if (!(container instanceof HTMLElement)) {
    return Math.max(block.clientWidth, colWidth);
  }
  const pad = tokenGap();
  const colRect = col.getBoundingClientRect();
  const crect = container.getBoundingClientRect();
  if (col.dataset.col === "0") {
    return Math.max(colWidth, colRect.right - crect.left - pad);
  }
  return Math.max(colWidth, crect.right - colRect.left - pad);
}

function bleedOuters(col: HTMLElement, maxWidth: number): void {
  for (const figure of col.querySelectorAll<HTMLElement>("[data-fit='outer']")) {
    const ratio = aspectOf(figure);
    if (ratio <= 0) continue;
    sizeOuter(figure, maxWidth / ratio, maxWidth, col);
  }
}

function stretchOuters(block: HTMLElement, col0: HTMLElement, col1: HTMLElement): void {
  bleedOuters(col0, outwardMax(block, col0));
  bleedOuters(col1, outwardMax(block, col1));

  const h0 = col0.getBoundingClientRect().height;
  const h1 = col1.getBoundingClientRect().height;
  const extra = Math.abs(h0 - h1);
  if (extra < EPSILON) return;

  const short = h0 > h1 ? col1 : col0;
  const outers = short.querySelectorAll<HTMLElement>("[data-fit='outer']");
  const figure = outers[outers.length - 1];
  if (!figure) return;

  const media = figure.querySelector<HTMLElement>(".case-study__media-element");
  const imageHeight = media?.getBoundingClientRect().height ?? figure.getBoundingClientRect().height;
  sizeOuter(figure, imageHeight + extra, leftoverMax(block, short), short);
}

function layoutStack(block: HTMLElement): void {
  clearContinuation(block);
  dismantleCols(block);
  resetOuters(block);
  block.dataset.mode = "stack";
}

function layoutTextFlow(block: HTMLElement): void {
  clearContinuation(block);
  dismantleCols(block);
  resetOuters(block);
  block.dataset.mode = "text-flow";
}

function layoutFlowAroundInner(block: HTMLElement, flow: HTMLElement, inner: HTMLElement): void {
  resetOuters(block);
  clearContinuation(block);
  const cols = ensureCols(block);
  if (!cols) return;
  const [col0, col1] = cols;
  block.dataset.mode = "flow-inner";
  col0.append(flow);
  col1.append(inner);

  const textHeight = flow.getBoundingClientRect().height;
  const innerHeight = inner.getBoundingClientRect().height;
  const gap = colGap(col1);
  if (textHeight <= innerHeight + EPSILON) return;

  const baseline = lineHeightOf(flow);
  const target = (textHeight + innerHeight + gap) / 2;
  const columnHeight = snapDown(target, baseline);
  if (columnHeight >= textHeight - EPSILON) return;

  const continuationHeight = snapUp(textHeight - columnHeight, baseline);
  if (continuationHeight <= EPSILON) return;

  flow.style.maxHeight = `${columnHeight}px`;
  flow.style.overflow = "hidden";

  const wrap = document.createElement("div");
  wrap.className = "case-study__continuation";
  wrap.dataset.flowClone = "true";
  wrap.setAttribute("aria-hidden", "true");
  wrap.style.height = `${continuationHeight}px`;

  const clone = flow.cloneNode(true) as HTMLElement;
  clone.style.maxHeight = "";
  clone.style.overflow = "";
  clone.style.marginTop = `-${columnHeight}px`;
  for (const el of clone.querySelectorAll<HTMLElement>("a, button, input, textarea, select")) {
    el.setAttribute("tabindex", "-1");
  }
  wrap.append(clone);
  col1.insertBefore(wrap, inner);
}

function layoutPair(block: HTMLElement, items: HTMLElement[]): void {
  const cols = ensureCols(block);
  if (!cols) return;
  const [col0, col1] = cols;
  resetOuters(block);
  clearContinuation(block);
  block.dataset.mode = "pair";
  col0.append(items[0]!);
  col1.append(items[1]!);
  stretchOuters(block, col0, col1);
}

function layoutPack(block: HTMLElement, items: HTMLElement[]): void {
  const cols = ensureCols(block);
  if (!cols) return;
  const [col0, col1] = cols;
  resetOuters(block);
  clearContinuation(block);
  block.dataset.mode = "pack";

  for (const item of items) col0.append(item);
  const gap = colGap(col0);
  const heights = items.map((item) => item.getBoundingClientRect().height);
  const total = heights.reduce((sum, h) => sum + h, 0) + gap * Math.max(0, items.length - 1);
  const target = total / 2;

  let used = 0;
  let split = items.length;
  for (let i = 0; i < items.length; i++) {
    const extra = i > 0 ? gap : 0;
    if (i > 0 && used + extra + heights[i]! > target) {
      split = i;
      break;
    }
    used += extra + heights[i]!;
  }

  for (const item of items.slice(0, split)) col0.append(item);
  for (const item of items.slice(split)) col1.append(item);
  stretchOuters(block, col0, col1);
}

function layoutBlock(block: HTMLElement): void {
  const items = itemsOf(block);
  if (items.length === 0) return;

  if (isColumnMode()) {
    block.dataset.mode = "column";
    resetOuters(block);
    clearContinuation(block);
    dismantleCols(block);
    return;
  }

  const texts = items.filter((item) => item.dataset.split === "true");
  const atomics = items.filter((item) => item.dataset.split !== "true");
  const flowItems = items.filter(isFlowItem);
  const inners = items.filter(isInnerMedia);

  if (items.length === 1) {
    if (flowItems.length === 1) layoutTextFlow(block);
    else layoutStack(block);
    return;
  }

  if (items.length === 2 && flowItems.length === 1 && inners.length === 1) {
    const flow = flowItems[0]!;
    const inner = inners[0]!;
    if (items.indexOf(flow) < items.indexOf(inner)) layoutFlowAroundInner(block, flow, inner);
    else layoutTextFlow(block);
    return;
  }

  if (items.length === 2 && texts.length >= 1 && atomics.length <= 1) {
    layoutTextFlow(block);
    return;
  }

  if (items.length === 2) {
    layoutPair(block, items);
    return;
  }

  layoutPack(block, items);
}

export function initCaseStudyLayout(): void {
  teardown?.();
  teardown = null;

  const blocks = Array.from(document.querySelectorAll<HTMLElement>("[data-case-study-block]"));
  if (blocks.length === 0) return;

  let closed = false;
  let frame = 0;
  const dirty = new Set<HTMLElement>(blocks);

  const flush = (): void => {
    frame = 0;
    if (closed) return;
    const pending = Array.from(dirty);
    dirty.clear();
    for (const block of pending) {
      if (document.contains(block)) layoutBlock(block);
    }
  };

  const schedule = (targets?: Iterable<HTMLElement>): void => {
    if (closed) return;
    if (targets) for (const block of targets) dirty.add(block);
    else for (const block of blocks) dirty.add(block);
    if (frame) return;
    frame = requestAnimationFrame(flush);
  };

  const widths = new WeakMap<HTMLElement, number>();
  const observer = new ResizeObserver((entries) => {
    const changed: HTMLElement[] = [];
    for (const entry of entries) {
      const el = entry.target as HTMLElement;
      const width = Math.round(entry.contentRect.width);
      if (widths.get(el) === width) continue;
      widths.set(el, width);
      changed.push(el);
    }
    if (changed.length) schedule(changed);
  });

  const onMq = (): void => schedule();
  mq.addEventListener("change", onMq);

  const loaders: Array<() => void> = [];
  for (const block of blocks) {
    observer.observe(block);
    for (const img of block.querySelectorAll("img")) {
      if (img.complete) continue;
      const onLoad = (): void => schedule([block]);
      img.addEventListener("load", onLoad, { once: true });
      loaders.push(() => img.removeEventListener("load", onLoad));
    }
    for (const video of block.querySelectorAll("video")) {
      if (video.readyState >= 1) continue;
      const onMeta = (): void => schedule([block]);
      video.addEventListener("loadedmetadata", onMeta, { once: true });
      loaders.push(() => video.removeEventListener("loadedmetadata", onMeta));
    }
  }

  void document.fonts?.ready.then(() => {
    if (!closed) schedule();
  });
  schedule();

  teardown = () => {
    closed = true;
    if (frame) cancelAnimationFrame(frame);
    observer.disconnect();
    mq.removeEventListener("change", onMq);
    for (const off of loaders) off();
  };
}
