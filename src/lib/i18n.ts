export const locales = ['es', 'en', 'pt', 'fr'] as const;

export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'es';

export const localeLabels: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  pt: 'Português',
  fr: 'Français',
};

export const localeFlags: Record<Locale, string> = {
  es: '🇵🇪',
  en: '🇺🇸',
  pt: '🇧🇷',
  fr: '🇫🇷',
};

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocaleFromUrl(pathname: string): Locale {
  const firstSegment = pathname.split('/').filter(Boolean)[0];

  if (isLocale(firstSegment)) {
    return firstSegment;
  }

  return defaultLocale;
}

export function removeLocaleFromPath(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);

  if (isLocale(segments[0])) {
    const clean = '/' + segments.slice(1).join('/');
    return clean === '/' ? '/' : clean;
  }

  return pathname;
}

const routeMap = {
  es: {
    packages: 'paquetes',
    tours: 'tours',
    destinations: 'destinos',
    about: 'nosotros',
    contact: 'contacto',
  },
  en: {
    packages: 'packages',
    tours: 'tours',
    destinations: 'destinations',
    about: 'about',
    contact: 'contact',
  },
  pt: {
    packages: 'packages',
    tours: 'tours',
    destinations: 'destinations',
    about: 'about',
    contact: 'contact',
  },
  fr: {
    packages: 'packages',
    tours: 'tours',
    destinations: 'destinations',
    about: 'about',
    contact: 'contact',
  },
} as const;

const normalizedToRouteKey: Record<string, keyof typeof routeMap.es> = {
  paquetes: 'packages',
  packages: 'packages',

  tours: 'tours',

  destinos: 'destinations',
  destinations: 'destinations',

  nosotros: 'about',
  about: 'about',

  contacto: 'contact',
  contact: 'contact',
};

export function localizePath(path: string, locale: Locale) {
  if (locale === defaultLocale) return path;
  if (path === '/') return `/${locale}`;
  return `/${locale}${path}`;
}

export function getLanguageSwitchUrl(pathname: string, targetLocale: Locale) {
  const currentLocale = getLocaleFromUrl(pathname);
  const cleanPath = removeLocaleFromPath(pathname);
  const segments = cleanPath.split('/').filter(Boolean);

  if (segments.length === 0) {
    return targetLocale === defaultLocale ? '/' : `/${targetLocale}`;
  }

  const firstSegment = segments[0];
  const routeKey = normalizedToRouteKey[firstSegment];

  if (!routeKey) {
    return targetLocale === defaultLocale
      ? cleanPath
      : `/${targetLocale}${cleanPath}`;
  }

  const targetSegment = routeMap[targetLocale][routeKey];
  const rest = segments.slice(1);

  const translatedPath = '/' + [targetSegment, ...rest].join('/');

  return targetLocale === defaultLocale
    ? translatedPath
    : `/${targetLocale}${translatedPath}`;
}