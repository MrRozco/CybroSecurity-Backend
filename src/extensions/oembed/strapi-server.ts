const LINKEDIN_PROVIDER_URL = 'https://www.linkedin.com/';
const LINKEDIN_DEFAULT_HEIGHT = 620;
const LINKEDIN_DEFAULT_WIDTH = 504;

const isLinkedInUrl = (url: string) => url.includes('linkedin.com');

const getLinkedInEmbedUrl = (url: string) => {
  const decodedUrl = decodeURIComponent(url);

  const activityMatch = decodedUrl.match(/activity[:/-](\d+)/i);
  if (activityMatch) {
    return `https://www.linkedin.com/embed/feed/update/urn:li:activity:${activityMatch[1]}`;
  }

  const shareMatch = decodedUrl.match(/share[:/-](\d+)/i);
  if (shareMatch) {
    return `https://www.linkedin.com/embed/feed/update/urn:li:share:${shareMatch[1]}`;
  }

  const ugcPostMatch = decodedUrl.match(/ugcPost[:/-](\d+)/i);
  if (ugcPostMatch) {
    return `https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:${ugcPostMatch[1]}`;
  }

  return null;
};

const buildLinkedInFallback = (url: string) => {
  const embedUrl = getLinkedInEmbedUrl(url);

  if (!embedUrl) {
    return {
      error: 'LinkedIn post URLs need to include an activity, share, or ugcPost id.',
    };
  }

  return {
    url,
    oembed: {
      type: 'rich',
      version: '1.0',
      provider_name: 'LinkedIn',
      provider_url: LINKEDIN_PROVIDER_URL,
      title: 'LinkedIn Post',
      width: LINKEDIN_DEFAULT_WIDTH,
      height: LINKEDIN_DEFAULT_HEIGHT,
      html: `<iframe src="${embedUrl}" width="${LINKEDIN_DEFAULT_WIDTH}" height="${LINKEDIN_DEFAULT_HEIGHT}" frameborder="0" allowfullscreen title="LinkedIn Post"></iframe>`,
    },
    thumbnail: null,
  };
};

export default (plugin: any) => {
  const originalOembedService = plugin.services.oembed;

  plugin.services.oembed = (...args: any[]) => {
    const service = originalOembedService(...args);
    const originalFetch = service.fetch.bind(service);

    return {
      ...service,
      async fetch(url: string) {
        if (!isLinkedInUrl(url)) {
          return originalFetch(url);
        }

        try {
          const response = await originalFetch(url);

          if (!response?.error) {
            return response;
          }
        } catch {
        }

        return buildLinkedInFallback(url);
      },
    };
  };

  return plugin;
};