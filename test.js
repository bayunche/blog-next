function distanceK_IDDFS(target, k, parentMap) {
  const res = [];

  function dls(node, prev, depth, limit) {
    if (!node) return;

    if (depth === limit) {

      // 距离为 k，只在 limit==k 时收集
      if (limit === k) res.push(node.val);
      return;
    }

    const p = parentMap.get(node);
    if (p && p !== prev) dls(p, node, depth + 1, limit);
    if (node.left && node.left !== prev) dls(node.left, node, depth + 1, limit);
    if (node.right && node.right !== prev) dls(node.right, node, depth + 1, limit);
  }
    // limit从0到k
  for (let limit = 0; limit <= k; limit++) {
    dls(target, null, 0, limit);
  }

  return res;
}
