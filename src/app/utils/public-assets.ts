export function getPublicAssetUrl(path: string) {
  const assetPath = path.replace(/^\/+/, '');
  return `${import.meta.env.BASE_URL}${assetPath}`;
}
