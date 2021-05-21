export const LIST_TYPES = {
  mpr: 'MPR',
  organ: 'ORGAN',
  bonus: 'BONUS',
  recommended: 'RECOMMENDED',
  news: 'NEWS',
  liturgical: 'LITURGICAL'
};

export const LIST_TITLES = {
  mpr: 'Popular Religiosa',
  liturgical: 'Cantos Litúrgicos',
  organ: 'Órgano',
  bonus: 'Bonus',
  recommended: 'Recomendadas',
  news: 'Novedades'
};

export const PAYMENT_TYPES = {
  unique: 'UNIQUE_PAYMENT',
  regular: 'REGULAR_PAYMENT',
};

export const GIFT_STATUS = {
  pendingEmailConfirmation: 'PENDING_EMAIL_CONFIRMATION',
  pendingPay: 'PENDING_PAY',
  payed: 'PAYED',
  cancelled: 'CANCELLED',
};

export const SETTINGS_TYPES = {
  lastVersion: 'LAST_VERSION', // ultima version de la app, obsoleto, ya no se usa, ahora se usa codepush
  expirationDayApp: 'EXPIRATION_DAY_APP', // obsoleto, ya no se usa, ahora se usa codepush
  dosslLink: 'DOSSL_LINK',
  acrisoladaLink: 'ACRISOLADA_LINK',
  landpageLink: 'LANDPAGE_LINK',
  freeDaysPeriod: 'FREE_DAYS_PERIOD', // cantidad de dias que dura el periodo de gracia.
  uniquePaymentPeriod: 'UNIQUE_PAYMENT_YEARS_PERIOD', // cantidad de meses que dura el acceso a la descarga
  uniquePaymentPrice: 'UNIQUE_PAYMENT_PRICE', // precio a pagar por el acceso a las descarga
  preloadHoursTime: 'PRELOAD_HOURS_TIME', // cantidad de horas que las canciones permanencen precargadas y se pueden reproducir offline
  maximumPreloadedSongs: 'MAXIMUM_PRELOADED_SONGS', // cantidad maxima de canciones que se pueden precargar
  isActiveNews: 'IS_ACTIVE_NEWS', // se se activa la seccion de noticias en el home
  isActiveRecommended: 'IS_ACTIVE_RECOMMENDED', // se se activa la seccion de recomendadas en el home
  socialNetworksLinkFace: 'SOCIAL_NETWORKS_LINK_FACE',
  socialNetworksLinkTwit: 'SOCIAL_NETWORKS_LINK_TWITT',
  socialNetworksLinkYou: 'SOCIAL_NETWORKS_LINK_YOU',
  liturgical: 'LITURGICAL',
  mpr: 'MPR',
  recommended: 'RECOMMENDED',
  bonus: 'BONUS',
  organ: 'ORGAN',
  news: 'NEWS'
};

export const PLAN_TYPES = {
  premium: 'PREMIUM',
  basic: 'BASIC'
};

export const NOTIFICATION_TYPES = {
  successPayment: 'SUCCESS_PAYMENT',
  successUniquePayment: 'SUCCESS_UNIQUE_PAYMENT',
  expiredPlan: 'EXPIRED_PLAN',
  newsNotification: 'NEWS_NOTIFICATION',
  forAll: 'FOR_ALL_USERS',
};

export const FIRST_INIT = 'FIRST_INIT_APP_CANTO';

export const CANTO_APP_TOKEN = 'TOKEN_AUTH_APP_CANTO';
export const VOLUME_CANTO_APP = 'VOLUME_APP_CANTO';
