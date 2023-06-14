import { request } from "http";

// import * as npm from '../../package.json';
const npm = require('../../package.json');
const configuration = require('../../config/config.json')

const name =  'DEV';

export const environment = {
  production: configuration.ENV.production,
  appName: configuration.ENV.appName,
  envName: configuration.ENV.envName,
  version: npm.version + ' | ' + name,

  isVisibleAtendedor: configuration.ENV.isVisibleAtendedor,

  keycloakAPI: configuration.ENV.keycloackAPI,

  cartQR: configuration.ENV.cartQR,
  // test : configuration.Microsoft365.clientId,
  // Transbank
  tbkApiKeyId: configuration.ENV.tbkApiKeyId,
  tbkApiKeySecret: configuration.ENV.tbkApiKeySecret,

  // 24/02
  tbkApiUrl: configuration.ENV.tbkApiUrl,
  apiChekPay: configuration.ENV.apiChekPay,
  apiTbkOneClickPay: configuration.ENV.apiTbkOneClickPay,
  apiTbkOneClickDelete: configuration.ENV.apiTbkOneClickDelete,
  // 17/08
  apiTbkWebPayPay: configuration.ENV.apiTbkWebPayPay,
  apiTbkWebPayStatusPay: configuration.ENV.apiTbkWebPayStatusPay,
  tbkTbkWebPayFrecuencia: configuration.ENV.tbkTbkWebPayFrecuencia, // 1 segundo
  tbkTbkWebPayTimeOut: configuration.ENV.tbkTbkWebPayTimeOut,  // 18 segundos

  tbkInscripcionFrecuencia: configuration.ENV.tbkInscripcionFrecuencia, // 1 segundo
  tbkInscripcionTimeOut: configuration.ENV.tbkInscripcionTimeOut,  // 18 segundos
  cargaFrecuencia: configuration.ENV.cargaFrecuencia, // 1 segundo
  cargaTImeOut: configuration.ENV.cargaTImeOut,  // 18 segundos

  // API
  apiEessServiceUrl: configuration.ENV.apiEessServiceUrl,
  apiEessReserveUrl: configuration.ENV.apiEessReserveUrl,
  apiTbkCardsUrl: configuration.ENV.apiTbkCardsUrl,
  // apiUser: 'https://www.desatapp.tk:3002',
  apiUser: configuration.ENV.apiUser,
  apiFusion: configuration.ENV.apiFusion,

  // Chalenge
  chalengeExpiresin: configuration.ENV.chalengeExpiresin, // minutos

  // Show eventLogs
  verbosePollingEvent: configuration.ENV.verbosePollingEvent,
  verbose: configuration.ENV.verbose,

  // PDF SOVOS-WRAPER
  sovosPdfURL: configuration.ENV.sovosPdfURL, // 'https://www.desatapp.tk:3000/pwa-pdf/'  // https://localhost:3000/pwa-pdf/

  // enableTimeout
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


