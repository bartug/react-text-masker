import React, { useEffect, useRef } from 'react';

export interface TextMaskProviderProps {
  authorized: boolean;
  maskChar?: string;
  visibleChars?: number;
  children: React.ReactNode;
}

const TextMaskProvider: React.FC<TextMaskProviderProps> = ({
  authorized,
  maskChar = '*',
  visibleChars = 0,
  children,
}) => {
  const originals = useRef(new WeakMap<Text, string>());
  const observerRef = useRef<MutationObserver | null>(null);

  const maskNode = (node: Text) => {
    if (!originals.current.has(node)) originals.current.set(node, node.nodeValue || '');
    const original = originals.current.get(node) ?? '';
    node.nodeValue = original.slice(0, visibleChars) + maskChar.repeat(Math.max(original.length - visibleChars, 0));
  };

  const restoreNode = (node: Text) => {
    const original = originals.current.get(node);
    if (original !== undefined) node.nodeValue = original;
  };

  const processTree = (root: Node, fn: (t: Text) => void) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n: Text | null;
    while ((n = walker.nextNode() as Text | null)) {
      if (n && n.nodeValue?.trim()) fn(n);
    }
  };

  useEffect(() => {
    const root = document.body;
    if (!root) return;

    processTree(root, authorized ? restoreNode : maskNode);

    if (!observerRef.current) {
      observerRef.current = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
          m.addedNodes.forEach((node) => processTree(node, authorized ? restoreNode : maskNode));
          if (m.type === 'characterData' && m.target instanceof Text) {
            authorized ? restoreNode(m.target) : maskNode(m.target);
          }
        });
      });

      observerRef.current.observe(root, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [authorized, maskChar, visibleChars]);

  return <>{children}</>;
};

export default TextMaskProvider;