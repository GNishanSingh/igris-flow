"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";

const iconPaths: Record<string, string> = {
  plug:
    "M8 2h2v4h4V2h2v4h2v2h-2v4a4 4 0 01-4 4h-2v4H9v-4H7a4 4 0 01-4-4V8H1V6h2V2h2v4h3V2z",
  device:
    "M4 4h16v10H4V4zm6 12h4v2h3v2H7v-2h3v-2z",
  chip:
    "M7 3h10v2h2v4h2v6h-2v4h-2v2H7v-2H5v-4H3V9h2V5h2V3zm2 4v10h6V7H9z",
  shield:
    "M12 2l7 3v5c0 5-3.5 9-7 11-3.5-2-7-6-7-11V5l7-3z",
  grid:
    "M3 3h6v6H3V3zm12 0h6v6h-6V3zM3 15h6v6H3v-6zm12 0h6v6h-6v-6z",
  radar:
    "M12 3a9 9 0 019 9h-2a7 7 0 10-7 7v2a9 9 0 010-18zm0 6a3 3 0 013 3h-2a1 1 0 10-1 1v2a3 3 0 010-6z",
  door:
    "M5 3h12a2 2 0 012 2v16H5V3zm8 8a1 1 0 100 2 1 1 0 000-2z",
  route:
    "M6 4h8a4 4 0 014 4v8a4 4 0 01-4 4H6v-2h8a2 2 0 002-2V8a2 2 0 00-2-2H6V4z",
  lock:
    "M7 10V7a5 5 0 0110 0v3h2v10H5V10h2zm2 0h6V7a3 3 0 00-6 0v3z",
  wave:
    "M3 9c3-3 6-3 9 0s6 3 9 0v3c-3 3-6 3-9 0s-6-3-9 0V9z",
  engine:
    "M4 7h4l2-3h4l2 3h4v10h-4l-2 3h-4l-2-3H4V7zm6 3v4h4v-4h-4z",
  cloud:
    "M7 18a4 4 0 010-8 5 5 0 019.6-1.4A4 4 0 1117 18H7z",
  bolt:
    "M13 2L3 14h7l-1 8 10-12h-7l1-8z",
  wrench:
    "M21 6l-4 4-3-3 4-4a5 5 0 00-6 6L4 16a2 2 0 102 2l7-7a5 5 0 006-5z",
  agent:
    "M12 3a5 5 0 015 5c0 2.2-1.5 4.1-3.5 4.8L15 20h-6l1.5-7.2A5 5 0 0112 3z",
  spark:
    "M12 2l2.2 5.1L19 9l-4.8 1.7L12 16l-2.2-5.3L5 9l4.8-1.9L12 2z",
  chat:
    "M4 4h16v10H7l-3 3V4z",
  archive:
    "M4 4h16v4H4V4zm2 6h12v10H6V10zm2 2v6h8v-6H8z",
  user:
    "M12 4a4 4 0 110 8 4 4 0 010-8zm-7 14a7 7 0 0114 0v2H5v-2z",
  database:
    "M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3zm8 6v6c0 1.7-3.6 3-8 3s-8-1.3-8-3V9c1.8 1.2 5.2 2 8 2s6.2-.8 8-2z",
  clock:
    "M12 4a8 8 0 110 16 8 8 0 010-16zm1 4h-2v5l4 2 1-1-3-2V8z",
  cache:
    "M4 6h16v4H4V6zm0 6h16v4H4v-4z",
  graph:
    "M5 17h14v2H5v-2zm2-4l4-4 3 3 5-5 2 2-7 7-3-3-3 3-2-2z",
  layers:
    "M12 3l8 4-8 4-8-4 8-4zm0 8l8 4-8 4-8-4 8-4z",
  warehouse:
    "M4 9l8-4 8 4v10H4V9zm4 2v6h4v-6H8zm6 0v6h4v-6h-4z",
  collector:
    "M4 4h16v4H4V4zm2 6h12v8H6v-8zm3 2v4h2v-4H9zm4 0v4h2v-4h-2z",
  filter:
    "M4 4h16l-6 7v7l-4 2v-9L4 4z",
  extract:
    "M4 4h16v12H4V4zm7 4v3H8l4 4 4-4h-3V8h-2z",
  storage:
    "M6 4h12l2 4v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8l2-4zm2 4h8v10H8V8z",
  monitor:
    "M4 5h16v10H4V5zm6 12h4v2h-4v-2z",
  search:
    "M11 4a7 7 0 105.3 12.1l3.3 3.3 1.4-1.4-3.3-3.3A7 7 0 0011 4z"
};

type NodeTone = "primary" | "secondary" | "highlight" | "muted";
type ShapeKind =
  | "rect"
  | "rounded"
  | "pill"
  | "diamond"
  | "hexagon"
  | "trapezoid"
  | "ellipse"
  | "cut"
  | "angled"
  | "ticket";
type NodeShape = ShapeKind;
type GroupShape = ShapeKind;

type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  icon: keyof typeof iconPaths;
  iconUrl?: string;
  fillColor?: string;
  strokeColor?: string;
  tone: NodeTone;
  shape?: NodeShape;
};

type Anchor = "left" | "right" | "top" | "bottom";
type LinkAnimation = "flow" | "light" | "none";
type LinkDirection = "forward" | "reverse";

type LinkEndpoint = {
  kind: "node" | "group";
  id: string;
  anchor: Anchor;
};

type Link = {
  id: string;
  from: LinkEndpoint;
  to: LinkEndpoint;
  tone?: NodeTone;
  color?: string;
  label?: string;
  animation?: LinkAnimation;
  animationDuration?: number;
  animationDirection?: LinkDirection;
};

type Group = {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  fillColor?: string;
  strokeColor?: string;
  shape?: GroupShape;
};

const viewBox = { width: 1600, height: 900 };
const iconOptions = Object.keys(iconPaths) as (keyof typeof iconPaths)[];
const anchorOptions: Anchor[] = ["left", "right", "top", "bottom"];
const nodeMinSize = { w: 80, h: 28 };
const groupMinSize = { w: 120, h: 120 };
const linkToneColors: Record<NodeTone, string> = {
  primary: "#6bd4ff",
  secondary: "#6ee7b7",
  highlight: "#fca5ff",
  muted: "#9aa7bf"
};
const linkAnimationDefaults: Record<Exclude<LinkAnimation, "none">, number> = {
  flow: 2.8,
  light: 6.4
};

type Selectable = { kind: "node" | "group"; id: string };
type SelectedItem = Selectable | null;
type LinkSeed = {
  from: { id: string; anchor: Anchor; kind?: "node" | "group" };
  to: { id: string; anchor: Anchor; kind?: "node" | "group" };
  tone?: NodeTone;
  color?: string;
  label?: string;
  animation?: LinkAnimation;
  animationDuration?: number;
  animationDirection?: LinkDirection;
};

const exportCss = `
.node { fill: rgba(13, 19, 36, 0.92); stroke: rgba(116, 144, 199, 0.5); stroke-width: 1; filter: drop-shadow(0 10px 24px rgba(7, 10, 18, 0.45)); }
.node.primary { stroke: rgba(107, 212, 255, 0.8); fill: rgba(14, 27, 45, 0.95); }
.node.secondary { stroke: rgba(110, 231, 183, 0.85); fill: rgba(14, 32, 28, 0.9); }
.node.highlight { stroke: rgba(252, 165, 255, 0.9); fill: rgba(30, 18, 44, 0.9); }
.node.muted { stroke: rgba(145, 155, 176, 0.5); fill: rgba(20, 23, 32, 0.9); }
.node.selected { stroke: rgba(246, 211, 101, 0.9); stroke-width: 1.6; }
.node.link-target { stroke: rgba(110, 231, 183, 0.75); fill: rgba(14, 32, 28, 0.85); }
.node.link-hover { stroke: rgba(246, 211, 101, 0.95); fill: rgba(30, 24, 12, 0.9); }
.icon-badge { fill: rgba(109, 212, 255, 0.18); stroke: rgba(109, 212, 255, 0.6); stroke-width: 1; }
.icon-badge.secondary { fill: rgba(110, 231, 183, 0.16); stroke: rgba(110, 231, 183, 0.7); }
.icon-badge.highlight { fill: rgba(252, 165, 255, 0.18); stroke: rgba(252, 165, 255, 0.7); }
.icon-path { fill: #e9f0ff; }
.node-label { fill: #e9f0ff; font-size: 12px; font-weight: 600; font-family: "Space Grotesk", "Segoe UI", sans-serif; }
.node-label.muted { fill: rgba(233, 240, 255, 0.7); }
.group { fill: rgba(9, 12, 22, 0.35); stroke: rgba(116, 144, 199, 0.4); stroke-dasharray: 6 6; stroke-width: 1; }
.group.selected { stroke: rgba(246, 211, 101, 0.85); stroke-width: 1.4; }
.group.link-target { stroke: rgba(110, 231, 183, 0.65); }
.group.link-hover { stroke: rgba(246, 211, 101, 0.95); }
.group-label { fill: rgba(233, 240, 255, 0.7); font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; font-family: "Space Grotesk", "Segoe UI", sans-serif; }
.link { stroke: rgba(108, 212, 255, 0.4); stroke-width: 1.4; fill: none; opacity: 0.85; }
.link-flow { stroke: rgba(108, 212, 255, 0.95); stroke-width: 2; fill: none; stroke-dasharray: 14 10; stroke-linecap: round; animation: linkFlow 2.8s linear infinite; }
.link-flow.light { stroke-width: 2.8; opacity: 0.9; stroke-dasharray: 18 82; stroke-linecap: round; animation: linkFlowLight 6.4s linear infinite; filter: drop-shadow(0 0 6px currentColor) drop-shadow(0 0 14px currentColor); }
.link.secondary { stroke: rgba(110, 231, 183, 0.4); }
.link.highlight { stroke: rgba(252, 165, 255, 0.4); }
.link.preview { stroke: rgba(246, 211, 101, 0.7); stroke-width: 1.6; stroke-dasharray: 6 6; opacity: 1; }
.link-label { fill: rgba(233, 240, 255, 0.8); font-size: 11px; font-weight: 600; font-family: "Space Grotesk", "Segoe UI", sans-serif; paint-order: stroke; stroke: rgba(6, 10, 20, 0.85); stroke-width: 3px; }
.link-hit { display: none; }
.link-button { display: none; }
.link-delete { fill: rgba(248, 113, 113, 0.9); stroke: rgba(248, 113, 113, 1); stroke-width: 1; }
.link-delete-icon { stroke: rgba(18, 10, 10, 0.9); stroke-width: 1.4; stroke-linecap: round; }
.connector-dot { display: none; }
.node-delete, .group-delete { display: none; }
@keyframes linkFlow { from { stroke-dashoffset: 0; } to { stroke-dashoffset: var(--flow-travel, -24px); } }
@keyframes linkFlowLight { from { stroke-dashoffset: 0; } to { stroke-dashoffset: var(--light-travel, -100px); } }
`;

const initialNodes: Node[] = [];

const initialGroups: Group[] = [];

const initialLinks: LinkSeed[] = [];

const anchorPoint = (item: { x: number; y: number; w: number; h: number }, anchor: Anchor) => {
  switch (anchor) {
    case "left":
      return { x: item.x, y: item.y + item.h / 2 };
    case "right":
      return { x: item.x + item.w, y: item.y + item.h / 2 };
    case "top":
      return { x: item.x + item.w / 2, y: item.y };
    default:
      return { x: item.x + item.w / 2, y: item.y + item.h };
  }
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const nodeCornerRadius = (node: Node) => {
  const shape = node.shape ?? "rounded";
  if (shape === "rect") {
    return 4;
  }
  if (shape === "pill") {
    return Math.min(node.h / 2, node.w / 2);
  }
  return 12;
};
const groupCornerRadius = (group: Group) => {
  const shape = group.shape ?? "rounded";
  if (shape === "rect") {
    return 8;
  }
  if (shape === "pill") {
    return Math.min(group.h / 2, group.w / 2);
  }
  return 16;
};
const shapePath = (shape: ShapeKind, x: number, y: number, w: number, h: number) => {
  const right = x + w;
  const bottom = y + h;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const hexInset = Math.min(w * 0.18, h * 0.3);
  const trapInset = Math.min(w * 0.18, h * 0.35);
  const cut = Math.min(w, h) * 0.18;
  const slant = Math.min(w * 0.16, h * 0.45);
  const notch = Math.min(h * 0.18, w * 0.12);
  switch (shape) {
    case "diamond":
      return `M ${cx} ${y} L ${right} ${cy} L ${cx} ${bottom} L ${x} ${cy} Z`;
    case "hexagon":
      return `M ${x + hexInset} ${y} L ${right - hexInset} ${y} L ${right} ${cy} L ${
        right - hexInset
      } ${bottom} L ${x + hexInset} ${bottom} L ${x} ${cy} Z`;
    case "trapezoid":
      return `M ${x + trapInset} ${y} L ${right - trapInset} ${y} L ${right} ${bottom} L ${x} ${bottom} Z`;
    case "cut":
      return `M ${x + cut} ${y} L ${right - cut} ${y} L ${right} ${y + cut} L ${right} ${
        bottom - cut
      } L ${right - cut} ${bottom} L ${x + cut} ${bottom} L ${x} ${bottom - cut} L ${x} ${
        y + cut
      } Z`;
    case "angled":
      return `M ${x + slant} ${y} L ${right} ${y} L ${right - slant} ${bottom} L ${x} ${bottom} Z`;
    case "ticket":
      return `M ${x} ${y} L ${right} ${y} L ${right} ${cy - notch} L ${right - notch} ${cy} L ${right} ${
        cy + notch
      } L ${right} ${bottom} L ${x} ${bottom} L ${x} ${cy + notch} L ${x + notch} ${cy} L ${x} ${
        cy - notch
      } Z`;
    default:
      return "";
  }
};

const getResizeEdges = (
  item: { x: number; y: number; w: number; h: number },
  point: { x: number; y: number },
  margin = 6
) => {
  const distLeft = Math.abs(point.x - item.x);
  const distRight = Math.abs(item.x + item.w - point.x);
  const distTop = Math.abs(point.y - item.y);
  const distBottom = Math.abs(item.y + item.h - point.y);
  const withinX = point.x >= item.x && point.x <= item.x + item.w;
  const withinY = point.y >= item.y && point.y <= item.y + item.h;
  if (!withinX || !withinY) {
    return { left: false, right: false, top: false, bottom: false };
  }
  const edgeX = Math.min(distLeft, distRight);
  const edgeY = Math.min(distTop, distBottom);
  const horizontal =
    edgeX <= margin ? (distLeft <= distRight ? { left: true, right: false } : { left: false, right: true }) : null;
  const vertical =
    edgeY <= margin ? (distTop <= distBottom ? { top: true, bottom: false } : { top: false, bottom: true }) : null;
  return {
    left: horizontal?.left ?? false,
    right: horizontal?.right ?? false,
    top: vertical?.top ?? false,
    bottom: vertical?.bottom ?? false
  };
};

const resizeCursorForEdges = (edges: { left: boolean; right: boolean; top: boolean; bottom: boolean }) => {
  const horizontal = edges.left || edges.right;
  const vertical = edges.top || edges.bottom;
  if (horizontal && vertical) {
    if ((edges.left && edges.top) || (edges.right && edges.bottom)) {
      return "nwse-resize";
    }
    return "nesw-resize";
  }
  if (horizontal) {
    return "ew-resize";
  }
  if (vertical) {
    return "ns-resize";
  }
  return "default";
};

const elbowPath = (
  from: { x: number; y: number },
  to: { x: number; y: number },
  offset: number,
  horizontalFirst: boolean
) => {
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);
  if (horizontalFirst) {
    const dir = from.x <= to.x ? 1 : -1;
    const stub = Math.min(32, dx / 2);
    const laneY = clamp(from.y + offset, 12, viewBox.height - 12);
    return `M ${from.x} ${from.y} L ${from.x + dir * stub} ${from.y} L ${from.x + dir * stub} ${laneY} L ${to.x - dir * stub} ${laneY} L ${to.x - dir * stub} ${to.y} L ${to.x} ${to.y}`;
  }
  const dir = from.y <= to.y ? 1 : -1;
  const stub = Math.min(32, dy / 2);
  const laneX = clamp(from.x + offset, 12, viewBox.width - 12);
  return `M ${from.x} ${from.y} L ${from.x} ${from.y + dir * stub} L ${laneX} ${from.y + dir * stub} L ${laneX} ${to.y - dir * stub} L ${to.x} ${to.y - dir * stub} L ${to.x} ${to.y}`;
};

const elbowLabelPoint = (
  from: { x: number; y: number },
  to: { x: number; y: number },
  offset: number,
  horizontalFirst: boolean
) => {
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);
  if (horizontalFirst) {
    const dir = from.x <= to.x ? 1 : -1;
    const stub = Math.min(32, dx / 2);
    const laneY = clamp(from.y + offset, 12, viewBox.height - 12);
    const x1 = from.x + dir * stub;
    const x2 = to.x - dir * stub;
    return { x: (x1 + x2) / 2, y: laneY };
  }
  const dir = from.y <= to.y ? 1 : -1;
  const stub = Math.min(32, dy / 2);
  const laneX = clamp(from.x + offset, 12, viewBox.width - 12);
  const y1 = from.y + dir * stub;
  const y2 = to.y - dir * stub;
  return { x: laneX, y: (y1 + y2) / 2 };
};

const resolveAnchors = (from: { x: number; y: number; w: number; h: number }, to: { x: number; y: number; w: number; h: number }) => {
  const fromCenter = { x: from.x + from.w / 2, y: from.y + from.h / 2 };
  const toCenter = { x: to.x + to.w / 2, y: to.y + to.h / 2 };
  const dx = toCenter.x - fromCenter.x;
  const dy = toCenter.y - fromCenter.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return {
      from: dx >= 0 ? "right" : "left",
      to: dx >= 0 ? "left" : "right"
    } satisfies { from: Anchor; to: Anchor };
  }
  return {
    from: dy >= 0 ? "bottom" : "top",
    to: dy >= 0 ? "top" : "bottom"
  } satisfies { from: Anchor; to: Anchor };
};

const anchorTowardPoint = (item: { x: number; y: number; w: number; h: number }, point: { x: number; y: number }) => {
  const center = { x: item.x + item.w / 2, y: item.y + item.h / 2 };
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0 ? "right" : "left";
  }
  return dy >= 0 ? "bottom" : "top";
};

export default function Home() {
  const [nodes, setNodes] = useState<Node[]>(() => initialNodes.map((node) => ({ ...node })));
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [groups, setGroups] = useState<Group[]>(() => initialGroups.map((group) => ({ ...group })));
  const [selected, setSelected] = useState<SelectedItem>(null);
  const [links, setLinks] = useState<Link[]>(() =>
    initialLinks.map((link, index) => ({
      id: `base-${index}`,
      from: { ...link.from, kind: link.from.kind ?? "node" },
      to: { ...link.to, kind: link.to.kind ?? "node" },
      tone: link.tone,
      color: link.color,
      label: link.label,
      animation: link.animation ?? "flow",
      animationDuration: link.animationDuration,
      animationDirection: link.animationDirection
    }))
  );
  const [linkDraft, setLinkDraft] = useState<{
    toId: string;
    toKind: "node" | "group";
    fromAnchor: Anchor;
    toAnchor: Anchor;
  }>({
    toId: "",
    toKind: "node",
    fromAnchor: "right",
    toAnchor: "left"
  });
  const [connectMode, setConnectMode] = useState(false);
  const [connectFrom, setConnectFrom] = useState<Selectable | null>(null);
  const [linkPreview, setLinkPreview] = useState<{ from: Selectable; to: { x: number; y: number } } | null>(null);
  const [linkHoverTarget, setLinkHoverTarget] = useState<Selectable | null>(null);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [hoveredGroupId, setHoveredGroupId] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isExportingGif, setIsExportingGif] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [hoverCursor, setHoverCursor] = useState<
    "default" | "grab" | "grabbing" | "ew-resize" | "ns-resize" | "nwse-resize" | "nesw-resize"
  >("default");
  const svgRef = useRef<SVGSVGElement | null>(null);
  const exportMenuRef = useRef<HTMLDivElement | null>(null);
  const iconObjectUrlsRef = useRef<Map<string, string>>(new Map());
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dragRef = useRef<{
    kind: "node" | "group";
    id: string;
    offsetX: number;
    offsetY: number;
    pointerId: number;
  } | null>(null);
  const linkDragRef = useRef<{ from: Selectable; pointerId: number } | null>(null);
  const resizeRef = useRef<{
    kind: "node" | "group";
    id: string;
    startX: number;
    startY: number;
    startItemX: number;
    startItemY: number;
    startW: number;
    startH: number;
    edges: { left: boolean; right: boolean; top: boolean; bottom: boolean };
    pointerId: number;
  } | null>(null);
  const idRef = useRef(1);
  const groupIdRef = useRef(1);
  const linkIdRef = useRef(initialLinks.length + 1);
  const animationEpochRef = useRef<number | null>(null);
  if (typeof performance !== "undefined" && animationEpochRef.current === null) {
    animationEpochRef.current = performance.now();
  }

  const nodeMap = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);
  const groupMap = useMemo(() => new Map(groups.map((group) => [group.id, group])), [groups]);
  const selectedNode = selected?.kind === "node" ? nodeMap.get(selected.id) ?? null : null;
  const selectedGroup = selected?.kind === "group" ? groupMap.get(selected.id) ?? null : null;
  const selectedLink = useMemo(
    () => (selectedLinkId ? links.find((link) => link.id === selectedLinkId) ?? null : null),
    [links, selectedLinkId]
  );
  const labelFor = (kind: "node" | "group", id: string) =>
    (kind === "node" ? nodeMap.get(id)?.label : groupMap.get(id)?.label) ?? id;
  const selectedLabel = selected ? labelFor(selected.kind, selected.id) : "";
  const selectedLabelWithKind = selected
    ? `${selected.kind === "group" ? "Group" : "Node"}: ${selectedLabel}`
    : "";
  const selectedLinkLabel = selectedLink
    ? `${selectedLink.from.kind === "group" ? "Group" : "Node"}: ${labelFor(
        selectedLink.from.kind,
        selectedLink.from.id
      )} (${selectedLink.from.anchor}) → ${
        selectedLink.to.kind === "group" ? "Group" : "Node"
      }: ${labelFor(selectedLink.to.kind, selectedLink.to.id)} (${selectedLink.to.anchor})`
    : "";
  const animationElapsed =
    typeof performance !== "undefined" && animationEpochRef.current !== null
      ? (performance.now() - animationEpochRef.current) / 1000
      : 0;
  const selectedIconUrl = selectedNode?.iconUrl?.trim() ?? "";
  const outgoingLinks = useMemo(() => {
    if (!selected) {
      return [];
    }
    return links.filter((link) => link.from.kind === selected.kind && link.from.id === selected.id);
  }, [links, selected]);
  const linkTargets = useMemo(() => {
    if (!selected) {
      return [];
    }
    const targets = [
      ...nodes.map((node) => ({ kind: "node" as const, id: node.id, label: node.label })),
      ...groups.map((group) => ({ kind: "group" as const, id: group.id, label: group.label }))
    ];
    return targets.filter((item) => !(item.kind === selected.kind && item.id === selected.id));
  }, [nodes, groups, selected]);
  const canAddLink =
    !!selected && !!linkDraft.toId && !(selected.kind === linkDraft.toKind && selected.id === linkDraft.toId);
  const linkOffsets = useMemo(() => {
    const spacing = 16;
    const groups = new Map<string, Link[]>();
    links.forEach((link) => {
      const key = `${link.from.kind}:${link.from.id}:${link.from.anchor}`;
      const list = groups.get(key);
      if (list) {
        list.push(link);
      } else {
        groups.set(key, [link]);
      }
    });
    const offsets = new Map<string, number>();
    groups.forEach((list) => {
      const total = list.length;
      list.forEach((link, index) => {
        const offset = (index - (total - 1) / 2) * spacing;
        offsets.set(link.id, offset);
      });
    });
    return offsets;
  }, [links]);
  const animationSyncDuration = useMemo(() => {
    const durations = links
      .filter((link) => (link.animation ?? "flow") !== "none")
      .map((link) =>
        link.animationDuration ??
        (link.animation === "light" ? linkAnimationDefaults.light : linkAnimationDefaults.flow)
      )
      .filter((value) => Number.isFinite(value) && value > 0);
    if (durations.length === 0) {
      return linkAnimationDefaults.flow;
    }
    return Math.max(...durations);
  }, [links]);
  const animationSyncOffset =
    animationSyncDuration > 0 ? animationElapsed % animationSyncDuration : 0;
  const connectStatus = connectMode
    ? connectFrom
      ? "Pick a target node or group"
      : "Pick a source node or group"
    : null;

  const toSvgPoint = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) {
      return { x: clientX, y: clientY };
    }
    const rect = svg.getBoundingClientRect();
    const scaleX = viewBox.width / rect.width;
    const scaleY = viewBox.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const hitTestSelectable = (point: { x: number; y: number }) => {
    for (let i = nodes.length - 1; i >= 0; i -= 1) {
      const node = nodes[i];
      if (point.x >= node.x && point.x <= node.x + node.w && point.y >= node.y && point.y <= node.y + node.h) {
        return { kind: "node", id: node.id } satisfies Selectable;
      }
    }
    for (let i = groups.length - 1; i >= 0; i -= 1) {
      const group = groups[i];
      if (point.x >= group.x && point.x <= group.x + group.w && point.y >= group.y && point.y <= group.y + group.h) {
        return { kind: "group", id: group.id } satisfies Selectable;
      }
    }
    return null;
  };

  const getItem = (item: Selectable) =>
    item.kind === "node" ? nodeMap.get(item.id) : groupMap.get(item.id);

  const startLinkDrag = (event: ReactPointerEvent<SVGElement>, item: Selectable) => {
    if (isLocked) {
      return;
    }
    const point = toSvgPoint(event.clientX, event.clientY);
    linkDragRef.current = { from: item, pointerId: event.pointerId };
    setLinkPreview({ from: item, to: point });
    svgRef.current?.setPointerCapture(event.pointerId);
  };

  const handleConnectorPointerDown = (event: ReactPointerEvent<SVGCircleElement>, node: Node) => {
    if (isLocked) {
      return;
    }
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const selectable = { kind: "node", id: node.id } satisfies Selectable;
    setSelected(selectable);
    startLinkDrag(event, selectable);
  };

  const handleConnectSelection = (event: ReactPointerEvent<SVGGElement>, kind: "node" | "group", id: string) => {
    if (isLocked) {
      return;
    }
    const selectedItem = { kind, id } satisfies Selectable;
    if (!connectFrom) {
      setConnectFrom(selectedItem);
      setSelected(selectedItem);
      startLinkDrag(event, selectedItem);
      return;
    }
    if (connectFrom.kind === kind && connectFrom.id === id) {
      startLinkDrag(event, selectedItem);
      return;
    }
    const fromItem = getItem(connectFrom);
    const toItem = getItem(selectedItem);
    if (fromItem && toItem) {
      const anchors = resolveAnchors(fromItem, toItem);
      const tone = connectFrom.kind === "node" ? (fromItem as Node).tone : "muted";
      addLink(connectFrom.kind, connectFrom.id, kind, id, anchors.from, anchors.to, tone);
    }
    setSelected(selectedItem);
    setConnectFrom(null);
  };

  const handlePointerDown = (event: ReactPointerEvent<SVGGElement>, node: Node) => {
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    setSelectedLinkId(null);
    setHoveredGroupId(null);
    if (isLocked) {
      setSelected({ kind: "node", id: node.id });
      return;
    }
    if (connectMode) {
      handleConnectSelection(event, "node", node.id);
      return;
    }
    const point = toSvgPoint(event.clientX, event.clientY);
    const edges = getResizeEdges(node, point);
    if (edges.left || edges.right || edges.top || edges.bottom) {
      handleResizeStart(event, "node", node, edges);
      return;
    }
    dragRef.current = {
      kind: "node",
      id: node.id,
      offsetX: point.x - node.x,
      offsetY: point.y - node.y,
      pointerId: event.pointerId
    };
    setSelected({ kind: "node", id: node.id });
    setDraggingId(node.id);
    setHoverCursor("grabbing");
    svgRef.current?.setPointerCapture(event.pointerId);
  };

  const handleGroupPointerDown = (event: ReactPointerEvent<SVGGElement>, group: Group) => {
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    setSelectedLinkId(null);
    setHoveredGroupId(group.id);
    if (isLocked) {
      setSelected({ kind: "group", id: group.id });
      return;
    }
    if (connectMode) {
      handleConnectSelection(event, "group", group.id);
      return;
    }
    const point = toSvgPoint(event.clientX, event.clientY);
    const edges = getResizeEdges(group, point);
    if (edges.left || edges.right || edges.top || edges.bottom) {
      handleResizeStart(event, "group", group, edges);
      return;
    }
    dragRef.current = {
      kind: "group",
      id: group.id,
      offsetX: point.x - group.x,
      offsetY: point.y - group.y,
      pointerId: event.pointerId
    };
    setSelected({ kind: "group", id: group.id });
    setDraggingId(null);
    setHoverCursor("grabbing");
    svgRef.current?.setPointerCapture(event.pointerId);
  };

  const handleCanvasPointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (event.target !== svgRef.current) {
      return;
    }
    setSelected(null);
    setSelectedLinkId(null);
    setHoveredGroupId(null);
    if (isLocked) {
      return;
    }
    if (connectMode) {
      setConnectFrom(null);
      setLinkPreview(null);
      setLinkHoverTarget(null);
      linkDragRef.current = null;
    }
  };

  useEffect(() => {
    if (!selected) {
      return;
    }
    const isValid = linkTargets.some((item) => item.id === linkDraft.toId && item.kind === linkDraft.toKind);
    const nextItem = isValid ? { id: linkDraft.toId, kind: linkDraft.toKind } : linkTargets[0];
    const nextId = nextItem?.id ?? "";
    const nextKind = nextItem?.kind ?? "node";
    if (nextId !== linkDraft.toId || nextKind !== linkDraft.toKind) {
      setLinkDraft((prev) => ({ ...prev, toId: nextId, toKind: nextKind }));
    }
  }, [selected, linkTargets, linkDraft.toId, linkDraft.toKind]);

  useEffect(() => {
    if (!connectFrom) {
      return;
    }
    const exists =
      connectFrom.kind === "node" ? nodeMap.has(connectFrom.id) : groupMap.has(connectFrom.id);
    if (!exists) {
      setConnectFrom(null);
    }
  }, [connectFrom, nodeMap, groupMap]);

  useEffect(() => {
    if (!exportMenuOpen) {
      return;
    }
    const handleOutsideClick = (event: MouseEvent) => {
      if (!exportMenuRef.current) {
        return;
      }
      if (exportMenuRef.current.contains(event.target as HTMLElement)) {
        return;
      }
      setExportMenuOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [exportMenuOpen]);

  const handlePointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (isLocked) {
      return;
    }
    if (linkDragRef.current && linkDragRef.current.pointerId === event.pointerId) {
      const point = toSvgPoint(event.clientX, event.clientY);
      const hover = hitTestSelectable(point);
      if (hover && linkDragRef.current.from.kind === hover.kind && linkDragRef.current.from.id === hover.id) {
        setLinkHoverTarget(null);
      } else {
        setLinkHoverTarget(hover);
      }
      setLinkPreview({ from: linkDragRef.current.from, to: point });
      return;
    }
    if (resizeRef.current) {
      const nextCursor = resizeCursorForEdges(resizeRef.current.edges);
      if (hoverCursor !== nextCursor) {
        setHoverCursor(nextCursor);
      }
    } else if (dragRef.current) {
      if (hoverCursor !== "grabbing") {
        setHoverCursor("grabbing");
      }
    } else if (!connectMode) {
      const point = toSvgPoint(event.clientX, event.clientY);
      let cursor: typeof hoverCursor = "default";
      for (let i = nodes.length - 1; i >= 0; i -= 1) {
        const node = nodes[i];
        const edges = getResizeEdges(node, point);
        if (edges.left || edges.right || edges.top || edges.bottom) {
          cursor = resizeCursorForEdges(edges);
          break;
        }
        if (point.x >= node.x && point.x <= node.x + node.w && point.y >= node.y && point.y <= node.y + node.h) {
          cursor = "grab";
          break;
        }
      }
      if (cursor === "default") {
        for (let i = groups.length - 1; i >= 0; i -= 1) {
          const group = groups[i];
          const edges = getResizeEdges(group, point);
          if (edges.left || edges.right || edges.top || edges.bottom) {
            cursor = resizeCursorForEdges(edges);
            break;
          }
          if (point.x >= group.x && point.x <= group.x + group.w && point.y >= group.y && point.y <= group.y + group.h) {
            cursor = "grab";
            break;
          }
        }
      }
      if (cursor !== hoverCursor) {
        setHoverCursor(cursor);
      }
    } else if (hoverCursor !== "default") {
      setHoverCursor("default");
    }
    if (resizeRef.current) {
      if (resizeRef.current.pointerId !== event.pointerId) {
        return;
      }
      const { id, startX, startY, startItemX, startItemY, startW, startH, edges, kind } = resizeRef.current;
      const point = toSvgPoint(event.clientX, event.clientY);
      const dx = point.x - startX;
      const dy = point.y - startY;
      if (kind === "node") {
        setNodes((prev) =>
          prev.map((node) => {
            if (node.id !== id) {
              return node;
            }
            const right = startItemX + startW;
            const bottom = startItemY + startH;
            let nextX = startItemX;
            let nextY = startItemY;
            let nextW = startW;
            let nextH = startH;
            if (edges.right) {
              const maxW = viewBox.width - startItemX;
              nextW = clamp(startW + dx, nodeMinSize.w, maxW);
            }
            if (edges.left) {
              const maxW = right;
              nextW = clamp(startW - dx, nodeMinSize.w, maxW);
              nextX = clamp(right - nextW, 0, right - nodeMinSize.w);
            }
            if (edges.bottom) {
              const maxH = viewBox.height - startItemY;
              nextH = clamp(startH + dy, nodeMinSize.h, maxH);
            }
            if (edges.top) {
              const maxH = bottom;
              nextH = clamp(startH - dy, nodeMinSize.h, maxH);
              nextY = clamp(bottom - nextH, 0, bottom - nodeMinSize.h);
            }
            return { ...node, x: nextX, y: nextY, w: nextW, h: nextH };
          })
        );
      } else {
        setGroups((prev) =>
          prev.map((group) => {
            if (group.id !== id) {
              return group;
            }
            const right = startItemX + startW;
            const bottom = startItemY + startH;
            let nextX = startItemX;
            let nextY = startItemY;
            let nextW = startW;
            let nextH = startH;
            if (edges.right) {
              const maxW = viewBox.width - startItemX;
              nextW = clamp(startW + dx, groupMinSize.w, maxW);
            }
            if (edges.left) {
              const maxW = right;
              nextW = clamp(startW - dx, groupMinSize.w, maxW);
              nextX = clamp(right - nextW, 0, right - groupMinSize.w);
            }
            if (edges.bottom) {
              const maxH = viewBox.height - startItemY;
              nextH = clamp(startH + dy, groupMinSize.h, maxH);
            }
            if (edges.top) {
              const maxH = bottom;
              nextH = clamp(startH - dy, groupMinSize.h, maxH);
              nextY = clamp(bottom - nextH, 0, bottom - groupMinSize.h);
            }
            return { ...group, x: nextX, y: nextY, w: nextW, h: nextH };
          })
        );
      }
      return;
    }
    if (!dragRef.current) {
      return;
    }
    if (dragRef.current.pointerId !== event.pointerId) {
      return;
    }
    const { id, offsetX, offsetY, kind } = dragRef.current;
    const point = toSvgPoint(event.clientX, event.clientY);
    if (kind === "node") {
      setNodes((prev) =>
        prev.map((node) => {
          if (node.id !== id) {
            return node;
          }
          const nextX = clamp(point.x - offsetX, 0, viewBox.width - node.w);
          const nextY = clamp(point.y - offsetY, 0, viewBox.height - node.h);
          if (nextX === node.x && nextY === node.y) {
            return node;
          }
          return { ...node, x: nextX, y: nextY };
        })
      );
      return;
    }
    setGroups((prev) =>
      prev.map((group) => {
        if (group.id !== id) {
          return group;
        }
        const nextX = clamp(point.x - offsetX, 0, viewBox.width - group.w);
        const nextY = clamp(point.y - offsetY, 0, viewBox.height - group.h);
        if (nextX === group.x && nextY === group.y) {
          return group;
        }
        return { ...group, x: nextX, y: nextY };
      })
    );
  };

  const handlePointerUp = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (isLocked) {
      return;
    }
    if (linkDragRef.current && linkDragRef.current.pointerId === event.pointerId) {
      const from = linkDragRef.current.from;
      const point = toSvgPoint(event.clientX, event.clientY);
      const target = hitTestSelectable(point);
      if (target && !(target.kind === from.kind && target.id === from.id)) {
        const fromItem = getItem(from);
        const toItem = getItem(target);
        if (fromItem && toItem) {
          const anchors = resolveAnchors(fromItem, toItem);
          const tone = from.kind === "node" ? (fromItem as Node).tone : "muted";
          addLink(from.kind, from.id, target.kind, target.id, anchors.from, anchors.to, tone);
          setSelected(target);
          setConnectFrom(null);
        }
      }
      if (svgRef.current?.hasPointerCapture(event.pointerId)) {
        svgRef.current.releasePointerCapture(event.pointerId);
      }
      linkDragRef.current = null;
      setLinkPreview(null);
      setLinkHoverTarget(null);
      setHoverCursor("default");
      return;
    }
    if (resizeRef.current && resizeRef.current.pointerId === event.pointerId) {
      if (svgRef.current?.hasPointerCapture(event.pointerId)) {
        svgRef.current.releasePointerCapture(event.pointerId);
      }
      resizeRef.current = null;
      setHoverCursor("default");
      return;
    }
    if (!dragRef.current) {
      return;
    }
    if (dragRef.current.pointerId !== event.pointerId) {
      return;
    }
    if (svgRef.current?.hasPointerCapture(event.pointerId)) {
      svgRef.current.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
    setDraggingId(null);
    setHoverCursor("default");
  };

  const handlePointerLeave = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!isLocked) {
      handlePointerUp(event);
      setHoverCursor("default");
    }
  };

  const handleAddNode = () => {
    if (isLocked) {
      return;
    }
    const id = `custom-${idRef.current++}`;
    const width = 150;
    const height = 40;
    const baseX = 180 + (nodes.length * 36) % (viewBox.width - width - 40);
    const baseY = 140 + (nodes.length * 28) % (viewBox.height - height - 40);
    const nextNode: Node = {
      id,
      label: `New Node ${idRef.current - 1}`,
      x: clamp(baseX, 24, viewBox.width - width - 24),
      y: clamp(baseY, 24, viewBox.height - height - 24),
      w: width,
      h: height,
      icon: "spark",
      iconUrl: "",
      tone: "secondary"
    };
    setNodes((prev) => [...prev, nextNode]);
    setSelected({ kind: "node", id });
  };

  const handleAddGroup = () => {
    if (isLocked) {
      return;
    }
    const id = `group-${groupIdRef.current++}`;
    const width = 300;
    const height = 200;
    const baseX = 260 + (groups.length * 40) % (viewBox.width - width - 40);
    const baseY = 120 + (groups.length * 30) % (viewBox.height - height - 40);
    const nextGroup: Group = {
      id,
      label: `Group ${groupIdRef.current - 1}`,
      x: clamp(baseX, 24, viewBox.width - width - 24),
      y: clamp(baseY, 24, viewBox.height - height - 24),
      w: width,
      h: height
    };
    setGroups((prev) => [...prev, nextGroup]);
    setSelected({ kind: "group", id });
  };

  const handleResizeStart = (
    event: ReactPointerEvent<SVGElement>,
    kind: "node" | "group",
    item: Node | Group,
    edges: { left: boolean; right: boolean; top: boolean; bottom: boolean }
  ) => {
    if (isLocked) {
      return;
    }
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const point = toSvgPoint(event.clientX, event.clientY);
    resizeRef.current = {
      kind,
      id: item.id,
      startX: point.x,
      startY: point.y,
      startItemX: item.x,
      startItemY: item.y,
      startW: item.w,
      startH: item.h,
      edges,
      pointerId: event.pointerId
    };
    setHoverCursor(resizeCursorForEdges(edges));
    setSelected({ kind, id: item.id });
    setDraggingId(null);
    dragRef.current = null;
    svgRef.current?.setPointerCapture(event.pointerId);
  };

  const handleRemoveSelected = () => {
    if (isLocked) {
      return;
    }
    if (!selected) {
      return;
    }
    if (selected.kind === "node") {
      removeNodeById(selected.id);
    } else {
      removeGroupById(selected.id);
    }
  };

  const removeNodeById = (nodeId: string) => {
    if (isLocked) {
      return;
    }
    revokeIconObjectUrl(nodeId);
    setNodes((prev) => prev.filter((node) => node.id !== nodeId));
    setLinks((prev) =>
      prev.filter(
        (link) =>
          !(link.from.kind === "node" && link.from.id === nodeId) &&
          !(link.to.kind === "node" && link.to.id === nodeId)
      )
    );
    if (connectFrom && connectFrom.kind === "node" && connectFrom.id === nodeId) {
      setConnectFrom(null);
    }
    if (selected?.kind === "node" && selected.id === nodeId) {
      setSelected(null);
    }
    setSelectedLinkId(null);
    setDraggingId(null);
    dragRef.current = null;
  };

  const removeGroupById = (groupId: string) => {
    if (isLocked) {
      return;
    }
    setGroups((prev) => prev.filter((group) => group.id !== groupId));
    setLinks((prev) =>
      prev.filter(
        (link) =>
          !(link.from.kind === "group" && link.from.id === groupId) &&
          !(link.to.kind === "group" && link.to.id === groupId)
      )
    );
    if (connectFrom && connectFrom.kind === "group" && connectFrom.id === groupId) {
      setConnectFrom(null);
    }
    if (selected?.kind === "group" && selected.id === groupId) {
      setSelected(null);
    }
    if (hoveredGroupId === groupId) {
      setHoveredGroupId(null);
    }
    setSelectedLinkId(null);
    setDraggingId(null);
    dragRef.current = null;
  };

  const handleClearCanvas = () => {
    if (isLocked) {
      return;
    }
    if (typeof window !== "undefined" && !window.confirm("Clear the entire canvas? This cannot be undone.")) {
      return;
    }
    iconObjectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    iconObjectUrlsRef.current.clear();
    setNodes([]);
    setGroups([]);
    setLinks([]);
    setSelected(null);
    setDraggingId(null);
    setConnectFrom(null);
    setConnectMode(false);
    setLinkPreview(null);
    setLinkHoverTarget(null);
    setSelectedLinkId(null);
    setHoveredGroupId(null);
    dragRef.current = null;
    resizeRef.current = null;
    linkDragRef.current = null;
  };

  const handleImportGraph = () => {
    if (isLocked) {
      return;
    }
    fileInputRef.current?.click();
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isLocked) {
      event.target.value = "";
      return;
    }
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!parsed || typeof parsed !== "object") {
          throw new Error("Invalid JSON");
        }
        iconObjectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
        iconObjectUrlsRef.current.clear();
        setNodes(Array.isArray(parsed.nodes) ? parsed.nodes : []);
        setGroups(Array.isArray(parsed.groups) ? parsed.groups : []);
        setLinks(
          Array.isArray(parsed.links)
            ? parsed.links.map((link: Link) => ({
                ...link,
                from: { ...link.from, kind: link.from.kind ?? "node" },
                to: { ...link.to, kind: link.to.kind ?? "node" },
                animation: link.animation ?? "flow",
                animationDuration: link.animationDuration,
                animationDirection: link.animationDirection
              }))
            : []
        );
        setSelected(null);
        setSelectedLinkId(null);
        setConnectFrom(null);
        setConnectMode(false);
        setLinkPreview(null);
        setLinkHoverTarget(null);
        dragRef.current = null;
        resizeRef.current = null;
        linkDragRef.current = null;
      } catch {
        window.alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const handleSaveGraph = () => {
    const payload = {
      name: "Igris Flow Builder",
      exportedAt: new Date().toISOString(),
      nodes: nodes.map((node) => ({
        ...node,
        iconSource: iconObjectUrlsRef.current.has(node.id)
          ? "file"
          : node.iconUrl?.trim()
            ? "url"
            : "builtin"
      })),
      groups,
      links
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "igris-flow-builder.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const buildSvgClone = async () => {
    const svg = svgRef.current;
    if (!svg) {
      return null;
    }
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    clone.setAttribute("width", `${viewBox.width}`);
    clone.setAttribute("height", `${viewBox.height}`);
    const defs =
      clone.querySelector("defs") ??
      clone.insertBefore(document.createElementNS("http://www.w3.org/2000/svg", "defs"), clone.firstChild);
    const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
    style.textContent = exportCss;
    defs.prepend(style);

    const backgroundLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
    backgroundLayer.setAttribute("id", "export-background");
    const baseRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    baseRect.setAttribute("x", "0");
    baseRect.setAttribute("y", "0");
    baseRect.setAttribute("width", `${viewBox.width}`);
    baseRect.setAttribute("height", `${viewBox.height}`);
    baseRect.setAttribute("fill", "#0d1324");
    backgroundLayer.appendChild(baseRect);
    if (showGrid) {
      const gridPattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
      gridPattern.setAttribute("id", "export-grid");
      gridPattern.setAttribute("patternUnits", "userSpaceOnUse");
      gridPattern.setAttribute("width", "32");
      gridPattern.setAttribute("height", "32");
      const gridPathH = document.createElementNS("http://www.w3.org/2000/svg", "path");
      gridPathH.setAttribute("d", "M 0 0 H 32");
      gridPathH.setAttribute("stroke", "rgba(255,255,255,0.03)");
      gridPathH.setAttribute("stroke-width", "1");
      const gridPathV = document.createElementNS("http://www.w3.org/2000/svg", "path");
      gridPathV.setAttribute("d", "M 0 0 V 32");
      gridPathV.setAttribute("stroke", "rgba(255,255,255,0.03)");
      gridPathV.setAttribute("stroke-width", "1");
      gridPattern.appendChild(gridPathH);
      gridPattern.appendChild(gridPathV);
      defs.appendChild(gridPattern);

      const gridRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      gridRect.setAttribute("x", "0");
      gridRect.setAttribute("y", "0");
      gridRect.setAttribute("width", `${viewBox.width}`);
      gridRect.setAttribute("height", `${viewBox.height}`);
      gridRect.setAttribute("fill", "url(#export-grid)");
      backgroundLayer.appendChild(gridRect);
    }
    clone.insertBefore(backgroundLayer, clone.firstChild);

    const images = Array.from(clone.querySelectorAll("image"));
    await Promise.all(
      images.map(async (image) => {
        const href = image.getAttribute("href") ?? image.getAttribute("xlink:href");
        if (!href || href.startsWith("data:")) {
          return;
        }
        try {
          const response = await fetch(href);
          const blob = await response.blob();
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error("Failed to read icon"));
            reader.readAsDataURL(blob);
          });
          image.setAttribute("href", dataUrl);
        } catch {
          // Keep the original href if inlining fails.
        }
      })
    );

    return clone;
  };

  const serializeSvg = (svg: SVGSVGElement) => {
    const serializer = new XMLSerializer();
    return `<?xml version="1.0" encoding="UTF-8"?>\n${serializer.serializeToString(svg)}`;
  };

  const buildSvgString = async () => {
    const clone = await buildSvgClone();
    return clone ? serializeSvg(clone) : null;
  };

  const handleSaveSvg = async () => {
    const svgString = await buildSvgString();
    if (!svgString) {
      return;
    }
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "igris-flow-builder.svg";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleSavePng = async () => {
    const svgString = await buildSvgString();
    if (!svgString) {
      return;
    }
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = viewBox.width;
      canvas.height = viewBox.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        return;
      }
      ctx.fillStyle = "#0d1324";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const pngUrl = canvas.toDataURL("image/png");
      const anchor = document.createElement("a");
      anchor.href = pngUrl;
      anchor.download = "igris-flow-builder.png";
      anchor.click();
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const getFlowPaths = (svg: SVGSVGElement) =>
    Array.from(svg.querySelectorAll<SVGPathElement>(".link-flow")).map((path) => {
      const animation = (path.dataset.animation as LinkAnimation | undefined) ?? "flow";
      const rawDuration = Number(path.dataset.duration);
      const duration =
        Number.isFinite(rawDuration) && rawDuration > 0
          ? rawDuration
          : animation === "light"
            ? linkAnimationDefaults.light
            : linkAnimationDefaults.flow;
      const direction = (path.dataset.direction as LinkDirection | undefined) ?? "forward";
      return {
        path,
        animation,
        duration,
        direction,
        baseStyle: path.getAttribute("style") ?? ""
      };
    });

  const applyFlowOffsets = (
    flows: Array<{
      path: SVGPathElement;
      animation: LinkAnimation;
      duration: number;
      direction: LinkDirection;
      baseStyle: string;
    }>,
    timeSeconds: number,
    syncDuration: number
  ) => {
    flows.forEach(({ path, animation, duration, direction, baseStyle }) => {
      if (animation === "none") {
        path.setAttribute("style", baseStyle);
        return;
      }
      const progress = syncDuration > 0 ? (timeSeconds % syncDuration) / syncDuration : 0;
      const travelBase = animation === "light" ? -100 : -24;
      const travelScale = duration > 0 ? syncDuration / duration : 1;
      const travel = travelBase * travelScale;
      const offset = direction === "reverse" ? travel * (1 - progress) : travel * progress;
      path.setAttribute("style", `${baseStyle}; animation: none; stroke-dashoffset: ${offset};`);
    });
  };

  const renderSvgToCanvas = async (
    svgString: string,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) =>
    new Promise<void>((resolve, reject) => {
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#0d1324";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        resolve();
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to render GIF frame."));
      };
      img.src = url;
    });

  const handleSaveGif = async () => {
    if (isExportingGif) {
      return;
    }
    setIsExportingGif(true);
    try {
      const clone = await buildSvgClone();
      if (!clone) {
        return;
      }
      const { default: GIF } = await import("gif.js");
      const workerScript = new URL("gif.js/dist/gif.worker.js", import.meta.url).toString();
      const gif = new GIF({
        workers: 2,
        quality: 10,
        workerScript,
        width: viewBox.width,
        height: viewBox.height
      });
      const flows = getFlowPaths(clone);
      const syncDuration = Math.max(
        linkAnimationDefaults.flow,
        ...flows.map((flow) => flow.duration).filter((value) => Number.isFinite(value) && value > 0)
      );
      const fps = 12;
      const durationSeconds = 3;
      const totalFrames = Math.max(1, Math.round(fps * durationSeconds));
      const canvas = document.createElement("canvas");
      canvas.width = viewBox.width;
      canvas.height = viewBox.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }
      for (let frame = 0; frame < totalFrames; frame += 1) {
        const timeSeconds = frame / fps;
        applyFlowOffsets(flows, timeSeconds, syncDuration);
        const svgString = serializeSvg(clone);
        await renderSvgToCanvas(svgString, canvas, ctx);
        gif.addFrame(canvas, { copy: true, delay: Math.round(1000 / fps) });
      }
      await new Promise<void>((resolve, reject) => {
        gif.on("finished", (blob: Blob) => {
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement("a");
          anchor.href = url;
          anchor.download = "igris-flow-builder.gif";
          anchor.click();
          URL.revokeObjectURL(url);
          resolve();
        });
        gif.on("abort", () => {
          reject(new Error("GIF export aborted."));
        });
        gif.render();
      });
    } finally {
      setIsExportingGif(false);
    }
  };

  const revokeIconObjectUrl = (nodeId: string) => {
    const url = iconObjectUrlsRef.current.get(nodeId);
    if (!url) {
      return;
    }
    URL.revokeObjectURL(url);
    iconObjectUrlsRef.current.delete(nodeId);
  };

  const updateSelectedNode = (patch: Partial<Node>) => {
    if (isLocked) {
      return;
    }
    if (selected?.kind !== "node") {
      return;
    }
    setNodes((prev) => prev.map((node) => (node.id === selected.id ? { ...node, ...patch } : node)));
  };

  const handleIconFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isLocked) {
      event.target.value = "";
      return;
    }
    if (selected?.kind !== "node") {
      return;
    }
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    revokeIconObjectUrl(selected.id);
    iconObjectUrlsRef.current.set(selected.id, objectUrl);
    updateSelectedNode({ iconUrl: objectUrl });
    event.target.value = "";
  };

  const handleIconUrlChange = (value: string) => {
    if (isLocked) {
      return;
    }
    if (selected?.kind !== "node") {
      return;
    }
    const existing = iconObjectUrlsRef.current.get(selected.id);
    if (existing && existing !== value) {
      revokeIconObjectUrl(selected.id);
    }
    updateSelectedNode({ iconUrl: value });
  };

  const handleIconSelectChange = (value: Node["icon"]) => {
    if (isLocked) {
      return;
    }
    if (selected?.kind !== "node") {
      return;
    }
    revokeIconObjectUrl(selected.id);
    updateSelectedNode({ icon: value, iconUrl: "" });
  };

  const updateSelectedGroup = (patch: Partial<Group>) => {
    if (isLocked) {
      return;
    }
    if (selected?.kind !== "group") {
      return;
    }
    setGroups((prev) => prev.map((group) => (group.id === selected.id ? { ...group, ...patch } : group)));
  };

  const updateSelectedLink = (patch: Partial<Link>) => {
    if (isLocked) {
      return;
    }
    if (!selectedLinkId) {
      return;
    }
    setLinks((prev) => prev.map((link) => (link.id === selectedLinkId ? { ...link, ...patch } : link)));
  };

  const handleAutoLayout = (direction: "horizontal" | "vertical") => {
    if (isLocked) {
      return;
    }
    const items = [
      ...nodes.map((node) => ({
        kind: "node" as const,
        id: node.id,
        x: node.x,
        y: node.y,
        w: node.w,
        h: node.h
      })),
      ...groups.map((group) => ({
        kind: "group" as const,
        id: group.id,
        x: group.x,
        y: group.y,
        w: group.w,
        h: group.h
      }))
    ];
    if (items.length === 0) {
      return;
    }
    const keyFor = (item: { kind: "node" | "group"; id: string }) => `${item.kind}:${item.id}`;
    const adjacency = new Map<string, string[]>();
    const indegree = new Map<string, number>();
    items.forEach((item) => {
      const key = keyFor(item);
      adjacency.set(key, []);
      indegree.set(key, 0);
    });
    links.forEach((link) => {
      const fromKey = `${link.from.kind}:${link.from.id}`;
      const toKey = `${link.to.kind}:${link.to.id}`;
      const list = adjacency.get(fromKey);
      if (!list || !adjacency.has(toKey)) {
        return;
      }
      list.push(toKey);
      indegree.set(toKey, (indegree.get(toKey) ?? 0) + 1);
    });
    const levels = new Map<string, number>();
    const queue = Array.from(indegree.entries())
      .filter(([, degree]) => degree === 0)
      .map(([key]) => key);
    while (queue.length > 0) {
      const key = queue.shift();
      if (!key) {
        break;
      }
      const level = levels.get(key) ?? 0;
      const neighbors = adjacency.get(key) ?? [];
      neighbors.forEach((nextKey) => {
        const nextLevel = Math.max(levels.get(nextKey) ?? 0, level + 1);
        levels.set(nextKey, nextLevel);
        indegree.set(nextKey, (indegree.get(nextKey) ?? 0) - 1);
        if (indegree.get(nextKey) === 0) {
          queue.push(nextKey);
        }
      });
    }
    items.forEach((item) => {
      const key = keyFor(item);
      if (!levels.has(key)) {
        levels.set(key, 0);
      }
    });
    const layers = new Map<number, typeof items>();
    items.forEach((item) => {
      const layer = levels.get(keyFor(item)) ?? 0;
      const list = layers.get(layer);
      if (list) {
        list.push(item);
      } else {
        layers.set(layer, [item]);
      }
    });
    const sortedLayers = Array.from(layers.keys()).sort((a, b) => a - b);
    const margin = 40;
    const layerGap = 140;
    const itemGap = 24;
    const positions = new Map<string, { x: number; y: number }>();
    if (direction === "horizontal") {
      let xCursor = margin;
      sortedLayers.forEach((layer) => {
        const layerItems = layers.get(layer) ?? [];
        layerItems.sort((a, b) => a.y - b.y || a.x - b.x);
        const maxWidth = Math.max(...layerItems.map((item) => item.w));
        let yCursor = margin;
        layerItems.forEach((item) => {
          const x = clamp(xCursor, 0, viewBox.width - item.w);
          const y = clamp(yCursor, 0, viewBox.height - item.h);
          positions.set(keyFor(item), { x, y });
          yCursor += item.h + itemGap;
        });
        xCursor += maxWidth + layerGap;
      });
    } else {
      let yCursor = margin;
      sortedLayers.forEach((layer) => {
        const layerItems = layers.get(layer) ?? [];
        layerItems.sort((a, b) => a.x - b.x || a.y - b.y);
        const maxHeight = Math.max(...layerItems.map((item) => item.h));
        let xCursor = margin;
        layerItems.forEach((item) => {
          const x = clamp(xCursor, 0, viewBox.width - item.w);
          const y = clamp(yCursor, 0, viewBox.height - item.h);
          positions.set(keyFor(item), { x, y });
          xCursor += item.w + itemGap;
        });
        yCursor += maxHeight + layerGap;
      });
    }
    setNodes((prev) =>
      prev.map((node) => {
        const next = positions.get(`node:${node.id}`);
        return next ? { ...node, x: next.x, y: next.y } : node;
      })
    );
    setGroups((prev) =>
      prev.map((group) => {
        const next = positions.get(`group:${group.id}`);
        return next ? { ...group, x: next.x, y: next.y } : group;
      })
    );
  };

  const applyLinkStyleToAll = () => {
    if (isLocked || !selectedLink) {
      return;
    }
    const { color, animation, animationDuration, animationDirection } = selectedLink;
    setLinks((prev) =>
      prev.map((link) => ({
        ...link,
        color,
        animation,
        animationDuration,
        animationDirection
      }))
    );
  };

  const handleEditLinkLabel = (link: Link) => {
    if (isLocked) {
      return;
    }
    const nextLabel = window.prompt("Link label", link.label ?? "");
    if (nextLabel === null) {
      return;
    }
    const trimmed = nextLabel.trim();
    setLinks((prev) =>
      prev.map((item) => (item.id === link.id ? { ...item, label: trimmed ? trimmed : undefined } : item))
    );
    setSelectedLinkId(link.id);
  };

  const selectedLinkAnimation = selectedLink?.animation ?? "flow";
  const selectedLinkDuration =
    selectedLink?.animationDuration ??
    (selectedLinkAnimation === "light" ? linkAnimationDefaults.light : linkAnimationDefaults.flow);
  const selectedLinkDirection = selectedLink?.animationDirection ?? "forward";
  const selectedLinkColor = selectedLink
    ? selectedLink.color ?? linkToneColors[selectedLink.tone ?? "primary"]
    : linkToneColors.primary;
  const layoutControls = (
    <div className="connections">
      <div className="connections-title">Auto layout</div>
      <div className="connections-actions">
        <button className="btn small" type="button" disabled={isLocked} onClick={() => handleAutoLayout("horizontal")}>
          Horizontal layers
        </button>
        <button className="btn small" type="button" disabled={isLocked} onClick={() => handleAutoLayout("vertical")}>
          Vertical layers
        </button>
      </div>
    </div>
  );
  const linkSettings = selectedLink ? (
    <div className="connections">
      <div className="connections-title">Link settings</div>
      <div className="connections-list">
        <div className="connection-row">
          <span>{selectedLinkLabel}</span>
        </div>
      </div>
      <div className="field">
        <label htmlFor="link-label">Link label</label>
        <input
          id="link-label"
          type="text"
          placeholder="Add a label"
          value={selectedLink.label ?? ""}
          disabled={isLocked}
          onChange={(event) => updateSelectedLink({ label: event.target.value })}
        />
      </div>
      <div className="field">
        <label htmlFor="link-animation">Animation</label>
        <select
          id="link-animation"
          value={selectedLinkAnimation}
          disabled={isLocked}
          onChange={(event) =>
            updateSelectedLink({ animation: event.target.value as LinkAnimation })
          }
        >
          <option value="flow">Flow</option>
          <option value="light">Light flow</option>
          <option value="none">None</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="link-duration">Animation duration (s)</label>
        <div className="field-row">
          <input
            id="link-duration"
            type="number"
            min={0.6}
            max={20}
            step={0.1}
            value={selectedLinkDuration}
            disabled={isLocked || selectedLinkAnimation === "none"}
            onChange={(event) => {
              const nextDuration = clamp(Number(event.target.value) || 0.6, 0.6, 20);
              updateSelectedLink({ animationDuration: nextDuration });
            }}
          />
          <button
            className="btn small ghost"
            type="button"
            disabled={isLocked || selectedLinkAnimation === "none"}
            onClick={() =>
              updateSelectedLink({
                animationDuration:
                  selectedLinkAnimation === "light"
                    ? linkAnimationDefaults.light
                    : linkAnimationDefaults.flow
              })
            }
          >
            Reset
          </button>
        </div>
      </div>
      <div className="field">
        <label htmlFor="link-direction">Animation direction</label>
        <select
          id="link-direction"
          value={selectedLinkDirection}
          disabled={isLocked || selectedLinkAnimation === "none"}
          onChange={(event) =>
            updateSelectedLink({ animationDirection: event.target.value as LinkDirection })
          }
        >
          <option value="forward">Forward</option>
          <option value="reverse">Reverse</option>
        </select>
      </div>
      <div className="field">
        <label>Link color</label>
        <div className="field-row">
          <input
            className="color-input"
            type="color"
            value={selectedLinkColor}
            disabled={isLocked}
            onChange={(event) => updateSelectedLink({ color: event.target.value })}
          />
          <button
            className="btn small ghost"
            type="button"
            disabled={isLocked || !selectedLink.color}
            onClick={() => updateSelectedLink({ color: undefined })}
          >
            Reset
          </button>
        </div>
      </div>
      <div className="field">
        <label>Apply to all</label>
        <button
          className="btn small"
          type="button"
          disabled={isLocked || !selectedLink}
          onClick={applyLinkStyleToAll}
        >
          Apply style to all links
        </button>
      </div>
    </div>
  ) : null;

  const addLink = (
    fromKind: "node" | "group",
    fromId: string,
    toKind: "node" | "group",
    toId: string,
    fromAnchor: Anchor,
    toAnchor: Anchor,
    tone?: NodeTone
  ) => {
    if (isLocked) {
      return;
    }
    setLinks((prev) => {
      const exists = prev.some(
        (link) =>
          link.from.kind === fromKind &&
          link.from.id === fromId &&
          link.to.kind === toKind &&
          link.to.id === toId &&
          link.from.anchor === fromAnchor &&
          link.to.anchor === toAnchor
      );
      return exists
        ? prev
        : [
            ...prev,
            {
              id: `custom-${linkIdRef.current++}`,
              from: { kind: fromKind, id: fromId, anchor: fromAnchor },
              to: { kind: toKind, id: toId, anchor: toAnchor },
              tone: tone ?? "primary",
              animation: "flow"
            }
          ];
    });
  };

  const handleAddLink = () => {
    if (isLocked) {
      return;
    }
    if (!selected) {
      return;
    }
    if (!linkDraft.toId || (linkDraft.toKind === selected.kind && linkDraft.toId === selected.id)) {
      return;
    }
    const exists =
      linkDraft.toKind === "node" ? nodeMap.has(linkDraft.toId) : groupMap.has(linkDraft.toId);
    if (!exists) {
      return;
    }
    const tone = selected.kind === "node" ? selectedNode?.tone : "muted";
    addLink(
      selected.kind,
      selected.id,
      linkDraft.toKind,
      linkDraft.toId,
      linkDraft.fromAnchor,
      linkDraft.toAnchor,
      tone
    );
  };

  const handleRemoveLink = (linkId: string) => {
    if (isLocked) {
      return;
    }
    setLinks((prev) => prev.filter((link) => link.id !== linkId));
    setSelectedLinkId((prev) => (prev === linkId ? null : prev));
  };

  const toggleLinkSelection = (linkId: string) => {
    setSelectedLinkId((prev) => (prev === linkId ? null : linkId));
  };

  return (
    <main className="page">
      <header className="header">
        <h1 className="title">Igris Flow Builder</h1>
      </header>

      <div className="toolbar">
        <div className="toolbar-actions">
          <button className="btn" type="button" onClick={handleImportGraph} disabled={isLocked}>
            Import JSON
          </button>
          <div className="dropdown" ref={exportMenuRef}>
            <button
              className={`btn ${exportMenuOpen ? "active" : ""}`}
              type="button"
              onClick={() => setExportMenuOpen((prev) => !prev)}
              aria-haspopup="menu"
              aria-expanded={exportMenuOpen}
              aria-controls="export-menu"
            >
              Export
            </button>
            {exportMenuOpen ? (
              <div className="dropdown-menu" role="menu" id="export-menu">
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={() => {
                    setExportMenuOpen(false);
                    handleSaveGraph();
                  }}
                  role="menuitem"
                >
                  Save JSON
                </button>
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={() => {
                    setExportMenuOpen(false);
                    handleSaveSvg();
                  }}
                  role="menuitem"
                >
                  Save SVG
                </button>
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={() => {
                    setExportMenuOpen(false);
                    handleSavePng();
                  }}
                  role="menuitem"
                >
                  Save PNG
                </button>
                <button
                  className="dropdown-item"
                  type="button"
                  disabled={isExportingGif}
                  onClick={() => {
                    setExportMenuOpen(false);
                    handleSaveGif();
                  }}
                  role="menuitem"
                >
                  {isExportingGif ? "Exporting GIF..." : "Save GIF"}
                </button>
              </div>
            ) : null}
          </div>
          <label className="lock-toggle">
            <input
              className="lock-toggle-input"
              type="checkbox"
              checked={isLocked}
              onChange={(event) => {
                const nextLocked = event.target.checked;
                setIsLocked(nextLocked);
                if (nextLocked) {
                  setConnectMode(false);
                  setConnectFrom(null);
                  setLinkPreview(null);
                  setLinkHoverTarget(null);
                  setSelectedLinkId(null);
                  setHoverCursor("default");
                  linkDragRef.current = null;
                }
              }}
            />
            <span className="lock-toggle-track" aria-hidden="true">
              <span className="lock-toggle-thumb" />
            </span>
            <span className="lock-toggle-label">{isLocked ? "Locked" : "Unlocked"}</span>
          </label>
          <button
            className={`btn ${connectMode ? "active" : ""}`}
            type="button"
            onClick={() => {
              if (isLocked) {
                return;
              }
              setConnectMode((prev) => !prev);
              setConnectFrom(null);
              setLinkPreview(null);
              setLinkHoverTarget(null);
              setSelectedLinkId(null);
              linkDragRef.current = null;
            }}
            disabled={isLocked}
          >
            {connectMode ? "Connecting..." : "Connect mode"}
          </button>
          <button
            className="btn ghost"
            type="button"
            onClick={handleRemoveSelected}
            disabled={!selected || isLocked}
          >
            Remove selected
          </button>
        </div>
        <div className="toolbar-status">
          {selected ? `Selected: ${selectedLabel}` : "Select a node or group"}
          {connectStatus ? ` • ${connectStatus}` : ""}
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={handleImportFile}
        style={{ display: "none" }}
      />

      <div className={`workbench ${isLocked ? "locked" : ""}`}>
        {!isLocked ? (
          <section className="editor">
            <div className="editor-title">Editor</div>
            <div className="editor-hint">Drag the edges of a node or group to resize.</div>
            {selectedNode ? (
              <div className="editor-grid">
                <div className="field">
                  <label htmlFor="node-label">Label</label>
                  <textarea
                    id="node-label"
                    value={selectedNode.label}
                    rows={2}
                    disabled={isLocked}
                    onChange={(event) => updateSelectedNode({ label: event.target.value })}
                  />
                </div>
                <div className="field">
                  <label htmlFor="node-width">Width</label>
                  <input
                    id="node-width"
                    type="number"
                    min={nodeMinSize.w}
                    max={600}
                    value={Math.round(selectedNode.w)}
                    disabled={isLocked}
                    onChange={(event) => {
                      const nextWidth = clamp(Number(event.target.value) || nodeMinSize.w, nodeMinSize.w, 600);
                      updateSelectedNode({
                        w: nextWidth,
                        x: clamp(selectedNode.x, 0, viewBox.width - nextWidth)
                      });
                    }}
                  />
                </div>
                <div className="field">
                  <label htmlFor="node-height">Height</label>
                  <input
                    id="node-height"
                    type="number"
                    min={nodeMinSize.h}
                    max={280}
                    value={Math.round(selectedNode.h)}
                    disabled={isLocked}
                    onChange={(event) => {
                      const nextHeight = clamp(Number(event.target.value) || nodeMinSize.h, nodeMinSize.h, 280);
                      updateSelectedNode({
                        h: nextHeight,
                        y: clamp(selectedNode.y, 0, viewBox.height - nextHeight)
                      });
                    }}
                  />
                </div>
                <div className="field">
                  <label htmlFor="node-shape">Shape</label>
                  <select
                    id="node-shape"
                    value={selectedNode.shape ?? "rounded"}
                    disabled={isLocked}
                    onChange={(event) => updateSelectedNode({ shape: event.target.value as NodeShape })}
                  >
                    <option value="rect">Rectangle</option>
                    <option value="rounded">Rounded</option>
                    <option value="pill">Pill</option>
                    <option value="diamond">Diamond</option>
                    <option value="hexagon">Hexagon</option>
                    <option value="trapezoid">Trapezoid</option>
                    <option value="ellipse">Ellipse</option>
                    <option value="cut">Cut corner</option>
                    <option value="angled">Angled</option>
                    <option value="ticket">Ticket</option>
                  </select>
                </div>
              <div className="field">
                <label htmlFor="node-icon">Icon / logo</label>
                <div className="field-row">
                  <span className="icon-preview" aria-hidden="true">
                    {selectedIconUrl ? (
                      <img src={selectedIconUrl} alt="" />
                    ) : (
                      <svg viewBox="0 0 24 24" role="img">
                        <path d={iconPaths[selectedNode.icon]} />
                      </svg>
                    )}
                  </span>
                  <select
                    id="node-icon"
                    value={selectedNode.icon}
                    disabled={isLocked}
                    onChange={(event) => handleIconSelectChange(event.target.value as Node["icon"])}
                  >
                    {iconOptions.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>
                <input type="file" accept="image/*" onChange={handleIconFileChange} disabled={isLocked} />
                <input
                  type="url"
                  placeholder="Icon URL (optional)"
                  value={selectedNode.iconUrl ?? ""}
                  disabled={isLocked}
                  onChange={(event) => handleIconUrlChange(event.target.value)}
                />
              </div>
              <div className="field">
                <label>Fill color</label>
                <div className="field-row">
                  <input
                    className="color-input"
                    type="color"
                    value={selectedNode.fillColor ?? "#0d1324"}
                    disabled={isLocked}
                    onChange={(event) => updateSelectedNode({ fillColor: event.target.value })}
                  />
                  <button
                    className="btn small ghost"
                    type="button"
                    disabled={isLocked}
                    onClick={() => updateSelectedNode({ fillColor: undefined })}
                  >
                    Reset
                  </button>
                </div>
              </div>
              <div className="field">
                <label>Stroke color</label>
                <div className="field-row">
                  <input
                    className="color-input"
                    type="color"
                    value={selectedNode.strokeColor ?? "#7d8bb0"}
                    disabled={isLocked}
                    onChange={(event) => updateSelectedNode({ strokeColor: event.target.value })}
                  />
                  <button
                    className="btn small ghost"
                    type="button"
                    disabled={isLocked}
                    onClick={() => updateSelectedNode({ strokeColor: undefined })}
                  >
                    Reset
                  </button>
                </div>
              </div>
              <div className="connections">
                  <div className="connections-title">Connections</div>
                  <div className="connections-controls">
                    <div className="field">
                    <label htmlFor="link-target">Connect to</label>
                    <select
                      id="link-target"
                      value={linkDraft.toId ? `${linkDraft.toKind}:${linkDraft.toId}` : ""}
                      disabled={isLocked || linkTargets.length === 0}
                      onChange={(event) => {
                        const value = event.target.value;
                        if (!value) {
                          setLinkDraft((prev) => ({ ...prev, toId: "", toKind: "node" }));
                          return;
                        }
                        const [kind, id] = value.split(":");
                        setLinkDraft((prev) => ({
                          ...prev,
                          toKind: kind === "group" ? "group" : "node",
                          toId: id ?? ""
                        }));
                      }}
                    >
                      {linkTargets.length === 0 ? (
                        <option value="">No available targets</option>
                      ) : (
                        linkTargets.map((item) => (
                          <option key={`${item.kind}:${item.id}`} value={`${item.kind}:${item.id}`}>
                            {item.kind === "group" ? `Group: ${item.label}` : `Node: ${item.label}`}
                          </option>
                        ))
                      )}
                    </select>
                    </div>
                    <div className="field">
                      <label htmlFor="link-from-anchor">From anchor</label>
                    <select
                      id="link-from-anchor"
                      value={linkDraft.fromAnchor}
                      disabled={isLocked}
                      onChange={(event) =>
                        setLinkDraft((prev) => ({ ...prev, fromAnchor: event.target.value as Anchor }))
                      }
                    >
                        {anchorOptions.map((anchor) => (
                          <option key={anchor} value={anchor}>
                            {anchor}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="link-to-anchor">To anchor</label>
                    <select
                      id="link-to-anchor"
                      value={linkDraft.toAnchor}
                      disabled={isLocked}
                      onChange={(event) =>
                        setLinkDraft((prev) => ({ ...prev, toAnchor: event.target.value as Anchor }))
                      }
                    >
                        {anchorOptions.map((anchor) => (
                          <option key={anchor} value={anchor}>
                            {anchor}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="connections-actions">
                    <button
                      className="btn small"
                      type="button"
                      onClick={handleAddLink}
                      disabled={isLocked || !canAddLink}
                    >
                      Add link
                    </button>
                  </div>
                  <div className="connections-list">
                    {outgoingLinks.length === 0 ? (
                      <div className="connection-empty">No outgoing links yet.</div>
                    ) : (
                    outgoingLinks.map((link) => {
                      const targetLabel = labelFor(link.to.kind, link.to.id);
                      return (
                        <div key={link.id} className="connection-row">
                          <span>
                            {selectedLabelWithKind} ({link.from.anchor}) →{" "}
                            {link.to.kind === "group" ? `Group: ${targetLabel}` : `Node: ${targetLabel}`} ({link.to.anchor})
                          </span>
                          <button
                            className="link-remove"
                            type="button"
                            onClick={() => handleRemoveLink(link.id)}
                            disabled={isLocked}
                          >
                            Remove
                          </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
                {linkSettings}
                {layoutControls}
              </div>
            ) : selectedGroup ? (
              <div className="editor-grid">
                <div className="field">
                  <label htmlFor="group-label">Group label</label>
                  <input
                    id="group-label"
                    type="text"
                    value={selectedGroup.label}
                    disabled={isLocked}
                    onChange={(event) => updateSelectedGroup({ label: event.target.value })}
                  />
                </div>
                <div className="field">
                  <label htmlFor="group-x">Group X</label>
                  <input
                    id="group-x"
                    type="number"
                    min={0}
                    max={viewBox.width - selectedGroup.w}
                    value={Math.round(selectedGroup.x)}
                    disabled={isLocked}
                    onChange={(event) =>
                      updateSelectedGroup({
                        x: clamp(Number(event.target.value) || 0, 0, viewBox.width - selectedGroup.w)
                      })
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor="group-y">Group Y</label>
                  <input
                    id="group-y"
                    type="number"
                    min={0}
                    max={viewBox.height - selectedGroup.h}
                    value={Math.round(selectedGroup.y)}
                    disabled={isLocked}
                    onChange={(event) =>
                      updateSelectedGroup({
                        y: clamp(Number(event.target.value) || 0, 0, viewBox.height - selectedGroup.h)
                      })
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor="group-width">Group width</label>
                  <input
                    id="group-width"
                    type="number"
                    min={groupMinSize.w}
                    max={1200}
                    value={Math.round(selectedGroup.w)}
                    disabled={isLocked}
                    onChange={(event) => {
                      const nextWidth = clamp(Number(event.target.value) || groupMinSize.w, groupMinSize.w, 1200);
                      updateSelectedGroup({
                        w: nextWidth,
                        x: clamp(selectedGroup.x, 0, viewBox.width - nextWidth)
                      });
                    }}
                  />
                </div>
              <div className="field">
                <label htmlFor="group-height">Group height</label>
                <input
                  id="group-height"
                  type="number"
                  min={groupMinSize.h}
                  max={900}
                  value={Math.round(selectedGroup.h)}
                  disabled={isLocked}
                  onChange={(event) => {
                    const nextHeight = clamp(Number(event.target.value) || groupMinSize.h, groupMinSize.h, 900);
                    updateSelectedGroup({
                      h: nextHeight,
                      y: clamp(selectedGroup.y, 0, viewBox.height - nextHeight)
                    });
                  }}
                />
              </div>
              <div className="field">
                <label htmlFor="group-shape">Group shape</label>
                <select
                  id="group-shape"
                  value={selectedGroup.shape ?? "rounded"}
                  disabled={isLocked}
                  onChange={(event) => updateSelectedGroup({ shape: event.target.value as GroupShape })}
                >
                  <option value="rect">Rectangle</option>
                  <option value="rounded">Rounded</option>
                  <option value="pill">Pill</option>
                  <option value="diamond">Diamond</option>
                  <option value="hexagon">Hexagon</option>
                  <option value="trapezoid">Trapezoid</option>
                  <option value="ellipse">Ellipse</option>
                  <option value="cut">Cut corner</option>
                  <option value="angled">Angled</option>
                  <option value="ticket">Ticket</option>
                </select>
              </div>
              <div className="field">
                <label>Fill color</label>
                <div className="field-row">
                  <input
                    className="color-input"
                    type="color"
                    value={selectedGroup.fillColor ?? "#0b0f1a"}
                    disabled={isLocked}
                    onChange={(event) => updateSelectedGroup({ fillColor: event.target.value })}
                  />
                  <button
                    className="btn small ghost"
                    type="button"
                    disabled={isLocked}
                    onClick={() => updateSelectedGroup({ fillColor: undefined })}
                  >
                    Reset
                  </button>
                </div>
              </div>
              <div className="field">
                <label>Stroke color</label>
                <div className="field-row">
                  <input
                    className="color-input"
                    type="color"
                    value={selectedGroup.strokeColor ?? "#7d8bb0"}
                    disabled={isLocked}
                    onChange={(event) => updateSelectedGroup({ strokeColor: event.target.value })}
                  />
                  <button
                    className="btn small ghost"
                    type="button"
                    disabled={isLocked}
                    onClick={() => updateSelectedGroup({ strokeColor: undefined })}
                  >
                    Reset
                  </button>
                </div>
              </div>
              <div className="connections">
                <div className="connections-title">Connections</div>
                <div className="connections-controls">
                  <div className="field">
                    <label htmlFor="link-target-group">Connect to</label>
                    <select
                      id="link-target-group"
                      value={linkDraft.toId ? `${linkDraft.toKind}:${linkDraft.toId}` : ""}
                      onChange={(event) => {
                        const value = event.target.value;
                        if (!value) {
                          setLinkDraft((prev) => ({ ...prev, toId: "", toKind: "node" }));
                          return;
                        }
                        const [kind, id] = value.split(":");
                        setLinkDraft((prev) => ({
                          ...prev,
                          toKind: kind === "group" ? "group" : "node",
                          toId: id ?? ""
                        }));
                      }}
                      disabled={isLocked || linkTargets.length === 0}
                    >
                      {linkTargets.length === 0 ? (
                        <option value="">No available targets</option>
                      ) : (
                        linkTargets.map((item) => (
                          <option key={`${item.kind}:${item.id}`} value={`${item.kind}:${item.id}`}>
                            {item.kind === "group" ? `Group: ${item.label}` : `Node: ${item.label}`}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="link-from-anchor-group">From anchor</label>
                    <select
                      id="link-from-anchor-group"
                      value={linkDraft.fromAnchor}
                      disabled={isLocked}
                      onChange={(event) =>
                        setLinkDraft((prev) => ({ ...prev, fromAnchor: event.target.value as Anchor }))
                      }
                    >
                      {anchorOptions.map((anchor) => (
                        <option key={anchor} value={anchor}>
                          {anchor}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="link-to-anchor-group">To anchor</label>
                    <select
                      id="link-to-anchor-group"
                      value={linkDraft.toAnchor}
                      disabled={isLocked}
                      onChange={(event) =>
                        setLinkDraft((prev) => ({ ...prev, toAnchor: event.target.value as Anchor }))
                      }
                    >
                      {anchorOptions.map((anchor) => (
                        <option key={anchor} value={anchor}>
                          {anchor}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="connections-actions">
                  <button
                    className="btn small"
                    type="button"
                    onClick={handleAddLink}
                    disabled={isLocked || !canAddLink}
                  >
                    Add link
                  </button>
                </div>
                <div className="connections-list">
                  {outgoingLinks.length === 0 ? (
                    <div className="connection-empty">No outgoing links yet.</div>
                  ) : (
                    outgoingLinks.map((link) => {
                      const targetLabel = labelFor(link.to.kind, link.to.id);
                      return (
                        <div key={link.id} className="connection-row">
                          <span>
                            {selectedLabelWithKind} ({link.from.anchor}) →{" "}
                            {link.to.kind === "group" ? `Group: ${targetLabel}` : `Node: ${targetLabel}`} ({link.to.anchor})
                          </span>
                          <button
                            className="link-remove"
                            type="button"
                            onClick={() => handleRemoveLink(link.id)}
                            disabled={isLocked}
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
              {linkSettings}
              {layoutControls}
            </div>
          ) : selectedLink ? (
            <div className="editor-grid">{linkSettings}</div>
          ) : (
            <div className="editor-empty">
              <p>Select a node or group to edit its content and size.</p>
              <div className="editor-actions">
                <button className="btn" type="button" onClick={handleAddNode} disabled={isLocked}>
                  Add node
                </button>
                <button className="btn" type="button" onClick={handleAddGroup} disabled={isLocked}>
                  Add group
                </button>
                <button className="btn" type="button" onClick={() => setShowGrid((prev) => !prev)}>
                  {showGrid ? "Hide grid" : "Show grid"}
                </button>
                <button className="btn danger" type="button" onClick={handleClearCanvas} disabled={isLocked}>
                  Clear canvas
                </button>
              </div>
              {layoutControls}
            </div>
          )}
        </section>
        ) : null}

        <section className={`diagram-card ${showGrid ? "with-grid" : "no-grid"}`}>
          <svg
            ref={svgRef}
            className="diagram"
            viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
            role="img"
            aria-label="Quilr system architecture diagram"
            style={{ cursor: hoverCursor }}
            onPointerDown={handleCanvasPointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            onPointerCancel={handlePointerUp}
          >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" stroke="context-stroke" />
            </marker>
            <clipPath id="icon-clip" clipPathUnits="userSpaceOnUse">
              <circle cx="12" cy="12" r="10" />
            </clipPath>
          </defs>

            {groups.map((group) => {
              const isSelected = selected?.kind === "group" && selected.id === group.id;
              const isLinking = !!linkPreview;
              const isFrom = linkPreview?.from.kind === "group" && linkPreview.from.id === group.id;
              const isHover = linkHoverTarget?.kind === "group" && linkHoverTarget.id === group.id;
              const linkClass = isLinking
                ? isSelected && !isFrom
                  ? ""
                  : isFrom
                    ? "link-source"
                    : isHover
                      ? "link-hover"
                      : "link-target"
                : "";
              const groupStyle =
                group.fillColor || group.strokeColor
                  ? { fill: group.fillColor ?? undefined, stroke: group.strokeColor ?? undefined }
                  : undefined;
              const isActiveDelete =
                hoveredGroupId === group.id || (selected?.kind === "group" && selected.id === group.id);
              return (
                <g
                  key={group.id}
                  className="group-wrap"
                  onPointerDown={(event) => handleGroupPointerDown(event, group)}
                  onPointerEnter={() => setHoveredGroupId(group.id)}
                  onPointerLeave={() => setHoveredGroupId((prev) => (prev === group.id ? null : prev))}
                >
                  {(() => {
                    const shape = group.shape ?? "rounded";
                    const className = `group ${isSelected ? "selected" : ""} ${linkClass}`;
                    if (shape === "ellipse") {
                      return (
                        <ellipse
                          className={className}
                          cx={group.x + group.w / 2}
                          cy={group.y + group.h / 2}
                          rx={group.w / 2}
                          ry={group.h / 2}
                          style={groupStyle}
                        />
                      );
                    }
                    if (shape === "rect" || shape === "rounded" || shape === "pill") {
                      return (
                        <rect
                          className={className}
                          x={group.x}
                          y={group.y}
                          width={group.w}
                          height={group.h}
                          rx={groupCornerRadius(group)}
                          style={groupStyle}
                        />
                      );
                    }
                    return (
                      <path
                        className={className}
                        d={shapePath(shape, group.x, group.y, group.w, group.h)}
                        style={groupStyle}
                      />
                    );
                  })()}
                </g>
              );
            })}

            {links.map((link) => {
              const fromItem =
                link.from.kind === "node" ? nodeMap.get(link.from.id) : groupMap.get(link.from.id);
              const toItem =
                link.to.kind === "node" ? nodeMap.get(link.to.id) : groupMap.get(link.to.id);
              if (!fromItem || !toItem) {
                return null;
              }
              const from = anchorPoint(fromItem, link.from.anchor);
              const to = anchorPoint(toItem, link.to.anchor);
              const offset = linkOffsets.get(link.id) ?? 0;
              const horizontalFirst = link.from.anchor === "left" || link.from.anchor === "right";
              const d = elbowPath(from, to, offset, horizontalFirst);
              const labelPoint = elbowLabelPoint(from, to, offset, horizontalFirst);
              const isSelectedLink = selectedLinkId === link.id;
              const linkColor = link.color ?? linkToneColors[link.tone ?? "primary"];
              const linkStyle = link.color ? { stroke: link.color } : undefined;
              const animation = link.animation ?? "flow";
              const animationDuration =
                link.animationDuration ??
                (animation === "light" ? linkAnimationDefaults.light : linkAnimationDefaults.flow);
              const animationDirection = link.animationDirection ?? "forward";
              const flowClass = animation === "light" ? "link-flow light" : "link-flow";
              const travelBase = animation === "light" ? -100 : -24;
              const travelScale = animationDuration > 0 ? animationSyncDuration / animationDuration : 1;
              const travelDistance = travelBase * travelScale;
              const flowStyle: CSSProperties = {
                stroke: linkColor,
                color: linkColor,
                animationDuration: `${animationSyncDuration}s`,
                animationDirection: animationDirection === "reverse" ? "reverse" : "normal",
                animationDelay: `-${animationSyncOffset}s`,
                ...(animation === "light"
                  ? { ["--light-travel" as const]: `${travelDistance}px` }
                  : { ["--flow-travel" as const]: `${travelDistance}px` })
              };
              const labelText = link.label?.trim();
              return (
                <g key={link.id} className="link-group">
                  <path d={d} className={`link ${link.tone ?? ""}`} markerEnd="url(#arrow)" style={linkStyle} />
                  {animation !== "none" ? (
                    <path
                      d={d}
                      className={flowClass}
                      data-animation={animation}
                      data-duration={animationDuration}
                      data-direction={animationDirection}
                      pathLength={animation === "light" ? 100 : undefined}
                      style={flowStyle}
                    />
                  ) : null}
                  <path
                    d={d}
                    className="link-hit"
                    onPointerDown={(event) => {
                      if (isLocked) {
                        return;
                      }
                      event.preventDefault();
                      event.stopPropagation();
                      toggleLinkSelection(link.id);
                    }}
                    onDoubleClick={(event) => {
                      if (isLocked) {
                        return;
                      }
                      event.preventDefault();
                      event.stopPropagation();
                      handleEditLinkLabel(link);
                    }}
                  />
                  {labelText ? (
                    <text
                      className="link-label"
                      x={labelPoint.x}
                      y={labelPoint.y - 8}
                      textAnchor="middle"
                      dominantBaseline="central"
                      style={{ fill: linkColor }}
                    >
                      {labelText}
                    </text>
                  ) : null}
                  {!isLocked ? (
                    <g
                      className={`link-button ${isSelectedLink ? "active" : ""}`}
                      transform={`translate(${labelPoint.x}, ${labelPoint.y})`}
                      onPointerDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        handleRemoveLink(link.id);
                      }}
                    >
                      <circle className="link-delete" cx="0" cy="0" r="7" />
                      <path className="link-delete-icon" d="M-3 -3 L3 3 M3 -3 L-3 3" />
                    </g>
                  ) : null}
                </g>
              );
            })}

            {linkPreview ? (() => {
              const fromItem = getItem(linkPreview.from);
              if (!fromItem) {
                return null;
              }
              const anchor = anchorTowardPoint(fromItem, linkPreview.to);
              const fromPoint = anchorPoint(fromItem, anchor);
              const horizontalFirst = anchor === "left" || anchor === "right";
              return (
                <path
                  d={elbowPath(fromPoint, linkPreview.to, 0, horizontalFirst)}
                  className="link preview"
                />
              );
            })() : null}

            {nodes.map((node) => {
              const badgeClass =
              node.tone === "highlight"
                ? "icon-badge highlight"
                : node.tone === "secondary"
                  ? "icon-badge secondary"
                  : "icon-badge";
            const labelLines = node.label.split("\n");
              const isSelected = selected?.kind === "node" && selected.id === node.id;
            const isLinking = !!linkPreview;
            const isFrom = linkPreview?.from.kind === "node" && linkPreview.from.id === node.id;
            const isHover = linkHoverTarget?.kind === "node" && linkHoverTarget.id === node.id;
            const linkClass = isLinking
              ? isSelected && !isFrom
                ? ""
                : isFrom
                  ? "link-source"
                  : isHover
                    ? "link-hover"
                    : "link-target"
              : "";
            const lineHeight = 14;
            const textBlockY = node.y + node.h / 2 - ((labelLines.length - 1) * lineHeight) / 2;
            const iconUrl = node.iconUrl?.trim();
            const nodeStyle =
              node.fillColor || node.strokeColor
                ? { fill: node.fillColor ?? undefined, stroke: node.strokeColor ?? undefined }
                : undefined;
              return (
                <g
                  key={node.id}
                  className={`node-group ${draggingId === node.id ? "dragging" : ""}`}
                  onPointerDown={(event) => handlePointerDown(event, node)}
                >
                {(() => {
                  const shape = node.shape ?? "rounded";
                  const className = `node ${node.tone} ${isSelected ? "selected" : ""} ${linkClass}`;
                  if (shape === "ellipse") {
                    return (
                      <ellipse
                        className={className}
                        cx={node.x + node.w / 2}
                        cy={node.y + node.h / 2}
                        rx={node.w / 2}
                        ry={node.h / 2}
                        style={nodeStyle}
                      />
                    );
                  }
                  if (shape === "rect" || shape === "rounded" || shape === "pill") {
                    return (
                      <rect
                        className={className}
                        x={node.x}
                        y={node.y}
                        width={node.w}
                        height={node.h}
                        rx={nodeCornerRadius(node)}
                        style={nodeStyle}
                      />
                    );
                  }
                  return (
                    <path className={className} d={shapePath(shape, node.x, node.y, node.w, node.h)} style={nodeStyle} />
                  );
                })()}
                <g transform={`translate(${node.x + 10}, ${node.y + node.h / 2 - 12})`}>
                  <circle className={badgeClass} cx="12" cy="12" r="12" />
                  {iconUrl ? (
                    <image
                      href={iconUrl}
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      preserveAspectRatio="xMidYMid meet"
                      clipPath="url(#icon-clip)"
                    />
                  ) : (
                    <g transform="translate(4, 4) scale(0.65)">
                      <path className="icon-path" d={iconPaths[node.icon]} />
                    </g>
                  )}
                </g>
                <text
                  className={`node-label ${node.tone === "muted" ? "muted" : ""}`}
                >
                  {labelLines.map((line, idx) => (
                    <tspan
                      key={`${node.id}-line-${idx}`}
                      x={node.x + 44}
                      y={textBlockY + idx * lineHeight}
                      dominantBaseline="middle"
                    >
                      {line}
                    </tspan>
                  ))}
                </text>
                {!isLocked ? (
                  <>
                    <circle
                      className="connector-dot"
                      cx={node.x + node.w / 2}
                      cy={node.y - 8}
                      r={5}
                      onPointerDown={(event) => handleConnectorPointerDown(event, node)}
                    />
                    <g
                      className={`node-delete ${isSelected ? "active" : ""}`}
                      transform={`translate(${node.x + node.w - 6}, ${node.y - 8})`}
                      onPointerDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        removeNodeById(node.id);
                      }}
                    >
                      <circle className="node-delete-bg" cx="0" cy="0" r="7" />
                      <path className="node-delete-icon" d="M-3 -3 L3 3 M3 -3 L-3 3" />
                    </g>
                  </>
                ) : null}
                </g>
              );
            })}

            {!isLocked
              ? groups.map((group) => {
                  const isActiveDelete =
                    hoveredGroupId === group.id || (selected?.kind === "group" && selected.id === group.id);
                  return (
                    <g
                      key={`${group.id}-delete`}
                      className={`group-delete ${isActiveDelete ? "active" : ""}`}
                      transform={`translate(${group.x + group.w - 8}, ${group.y - 8})`}
                      onPointerDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        removeGroupById(group.id);
                      }}
                    >
                      <circle className="node-delete-bg" cx="0" cy="0" r="7" />
                      <path className="node-delete-icon" d="M-3 -3 L3 3 M3 -3 L-3 3" />
                    </g>
                  );
                })
              : null}

            {groups.map((group) => (
              <text key={`${group.id}-label`} className="group-label" x={group.x + 16} y={group.y + 22}>
                {group.label}
              </text>
            ))}
          </svg>
        </section>
      </div>

      <div className="legend">
        <span>
          <i style={{ background: "rgba(108, 212, 255, 0.6)" }} /> Core runtime flow
        </span>
        <span>
          <i style={{ background: "rgba(110, 231, 183, 0.6)" }} /> Policy and data enrichment
        </span>
        <span>
          <i style={{ background: "rgba(252, 165, 255, 0.6)" }} /> Human-in-the-loop channel
        </span>
      </div>
    </main>
  );
}
