// import * as npm from '../../package.json';
const npm = require('../../package.json');

const configuration = require('../../config/config.json')

const name = 'PRO';

export const environment = {
  production: configuration.ENV.production,
  appName: configuration.ENV.appName,
  envName: configuration.ENV.envName,
  version: npm.version + ' | ' + name,

  isVisibleAtendedor: configuration.ENV.isVisibleAtendedor,

  keycloakAPI: configuration.ENV.keycloakAPI,
  cartQR: configuration.ENV.cartQR,
  tbkApiKeyId: configuration.ENV.tbkApiKeyId,
  tbkApiKeySecret: configuration.ENV.tbkApiKeySecret,
  tbkInscripcionFrecuencia: configuration.ENV.tbkInscripcionFrecuencia, // 1 segundo
  tbkInscripcionTimeOut: configuration.ENV.tbkInscripcionTimeOut,  // 180 segundos


  // API -- 20/02/2021
  apiEessReserveUrl: configuration.ENV.apiEessReserveUrl,
  apiEessServiceUrl: configuration.ENV.apiEessServiceUrl,
  apiTbkCardsUrl: configuration.ENV.apiTbkCardsUrl,
  apiChekPay: configuration.ENV.apiChekPay,
  apiTbkOneClickPay: configuration.ENV.apiTbkOneClickPay,
  apiTbkWebPayPay: configuration.ENV.apiTbkWebPayPay,
  apiTbkWebPayStatusPay: configuration.ENV.apiTbkWebPayStatusPay,
  tbkTbkWebPayFrecuencia: configuration.ENV.tbkTbkWebPayFrecuencia, // 1 segundo
  tbkTbkWebPayTimeOut: configuration.ENV.tbkTbkWebPayTimeOut,  // 18 segundos

  apiUser: configuration.ENV.apiUser,
  apiTbkOneClickDelete: configuration.ENV.apiTbkOneClickDelete,
  apiFusion: configuration.ENV.apiFusion,
  tbkApiUrl: configuration.ENV.tbkApiUrl,
  cargaFrecuencia: configuration.ENV.cargaFrecuencia, // 1 segundo
  cargaTImeOut: configuration.ENV.cargaTImeOut,  // 18 segundos
  chalengeExpiresin: configuration.ENV.chalengeExpiresin, 
  verbosePollingEvent: configuration.ENV.verbosePollingEvent,
  verbose: configuration.ENV.verbose,
  // PDF SOVOS-WRAPER
  sovosPdfURL: configuration.ENV.sovosPdfURL,
  enableTimeOut: configuration.ENV.enableTimeOut,
  storageTimeToLive: configuration.ENV.storageTimeToLive, // 5 minutos
  // Permite el regstro, login y administración tarjetas sin QR ----
  qrModeOnly: configuration.ENV.qrModeOnly,
  // NOTIFICATION API
  notification: configuration.ENV.NOTIFICATION_API,
  // FIREBASE
  firebaseConfig: {
    apiKey: configuration.ENV.apiKey,
    authDomain: configuration.ENV.authDomain,
    databaseURL: configuration.ENV.databaseURL,
    projectId: configuration.ENV.projectId,
    storageBucket: configuration.ENV.storageBucket,
    messagingSenderId: configuration.ENV.messagingSenderId,
    appId: configuration.ENV.appId,
    measurementId: configuration.ENV.measurementId
  }
};
