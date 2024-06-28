export function useShareDemo() {
  const handleShareDemo = () => {
    const currentUrl = new URL(window.location.href);
    const url = new URL(window.location.origin);
    const configState = currentUrl.searchParams.get('configState');
    const secondaryEnvBrand = currentUrl.searchParams.get('secondaryEnvBrand');
    const primaryEnvBrand = currentUrl.searchParams.get('primaryEnvBrand');

    if (configState) {
      url.searchParams.set('configState', configState);
    }

    if (secondaryEnvBrand) {
      url.searchParams.set('secondaryEnvBrand', secondaryEnvBrand);
    }

    if (primaryEnvBrand) {
      url.searchParams.set('primaryEnvBrand', primaryEnvBrand);
    }

    if ('share' in window.navigator) {
      window.navigator.share({ url: url.toString() });
    } else {
      // Fallback for browsers that don't support Web Share API.
      // Copy the URL to clipboard.
      navigator.clipboard.writeText(url.toString());
    }
  };

  return {
    handleShareDemo,
  };
}
