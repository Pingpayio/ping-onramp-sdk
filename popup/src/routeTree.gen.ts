/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { Route as rootRouteImport } from './routes/__root'
import { Route as LayoutRouteImport } from './routes/_layout'
import { Route as LayoutIndexRouteImport } from './routes/_layout/index'
import { Route as LayoutOnrampIndexRouteImport } from './routes/_layout/onramp/index'
import { Route as LayoutOnrampProcessingRouteImport } from './routes/_layout/onramp/processing'
import { Route as LayoutOnrampInitiatingRouteImport } from './routes/_layout/onramp/initiating'
import { Route as LayoutOnrampFormEntryRouteImport } from './routes/_layout/onramp/form-entry'
import { Route as LayoutOnrampErrorRouteImport } from './routes/_layout/onramp/error'
import { Route as LayoutOnrampConnectWalletRouteImport } from './routes/_layout/onramp/connect-wallet'
import { Route as LayoutOnrampCompleteRouteImport } from './routes/_layout/onramp/complete'
import { Route as LayoutOnrampCallbackIndexRouteImport } from './routes/_layout/onramp/callback/index'

const LayoutRoute = LayoutRouteImport.update({
  id: '/_layout',
  getParentRoute: () => rootRouteImport,
} as any)
const LayoutIndexRoute = LayoutIndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => LayoutRoute,
} as any)
const LayoutOnrampIndexRoute = LayoutOnrampIndexRouteImport.update({
  id: '/onramp/',
  path: '/onramp/',
  getParentRoute: () => LayoutRoute,
} as any)
const LayoutOnrampProcessingRoute = LayoutOnrampProcessingRouteImport.update({
  id: '/onramp/processing',
  path: '/onramp/processing',
  getParentRoute: () => LayoutRoute,
} as any)
const LayoutOnrampInitiatingRoute = LayoutOnrampInitiatingRouteImport.update({
  id: '/onramp/initiating',
  path: '/onramp/initiating',
  getParentRoute: () => LayoutRoute,
} as any)
const LayoutOnrampFormEntryRoute = LayoutOnrampFormEntryRouteImport.update({
  id: '/onramp/form-entry',
  path: '/onramp/form-entry',
  getParentRoute: () => LayoutRoute,
} as any)
const LayoutOnrampErrorRoute = LayoutOnrampErrorRouteImport.update({
  id: '/onramp/error',
  path: '/onramp/error',
  getParentRoute: () => LayoutRoute,
} as any)
const LayoutOnrampConnectWalletRoute =
  LayoutOnrampConnectWalletRouteImport.update({
    id: '/onramp/connect-wallet',
    path: '/onramp/connect-wallet',
    getParentRoute: () => LayoutRoute,
  } as any)
const LayoutOnrampCompleteRoute = LayoutOnrampCompleteRouteImport.update({
  id: '/onramp/complete',
  path: '/onramp/complete',
  getParentRoute: () => LayoutRoute,
} as any)
const LayoutOnrampCallbackIndexRoute =
  LayoutOnrampCallbackIndexRouteImport.update({
    id: '/onramp/callback/',
    path: '/onramp/callback/',
    getParentRoute: () => LayoutRoute,
  } as any)

export interface FileRoutesByFullPath {
  '/': typeof LayoutIndexRoute
  '/onramp/complete': typeof LayoutOnrampCompleteRoute
  '/onramp/connect-wallet': typeof LayoutOnrampConnectWalletRoute
  '/onramp/error': typeof LayoutOnrampErrorRoute
  '/onramp/form-entry': typeof LayoutOnrampFormEntryRoute
  '/onramp/initiating': typeof LayoutOnrampInitiatingRoute
  '/onramp/processing': typeof LayoutOnrampProcessingRoute
  '/onramp': typeof LayoutOnrampIndexRoute
  '/onramp/callback': typeof LayoutOnrampCallbackIndexRoute
}
export interface FileRoutesByTo {
  '/': typeof LayoutIndexRoute
  '/onramp/complete': typeof LayoutOnrampCompleteRoute
  '/onramp/connect-wallet': typeof LayoutOnrampConnectWalletRoute
  '/onramp/error': typeof LayoutOnrampErrorRoute
  '/onramp/form-entry': typeof LayoutOnrampFormEntryRoute
  '/onramp/initiating': typeof LayoutOnrampInitiatingRoute
  '/onramp/processing': typeof LayoutOnrampProcessingRoute
  '/onramp': typeof LayoutOnrampIndexRoute
  '/onramp/callback': typeof LayoutOnrampCallbackIndexRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/_layout': typeof LayoutRouteWithChildren
  '/_layout/': typeof LayoutIndexRoute
  '/_layout/onramp/complete': typeof LayoutOnrampCompleteRoute
  '/_layout/onramp/connect-wallet': typeof LayoutOnrampConnectWalletRoute
  '/_layout/onramp/error': typeof LayoutOnrampErrorRoute
  '/_layout/onramp/form-entry': typeof LayoutOnrampFormEntryRoute
  '/_layout/onramp/initiating': typeof LayoutOnrampInitiatingRoute
  '/_layout/onramp/processing': typeof LayoutOnrampProcessingRoute
  '/_layout/onramp/': typeof LayoutOnrampIndexRoute
  '/_layout/onramp/callback/': typeof LayoutOnrampCallbackIndexRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/onramp/complete'
    | '/onramp/connect-wallet'
    | '/onramp/error'
    | '/onramp/form-entry'
    | '/onramp/initiating'
    | '/onramp/processing'
    | '/onramp'
    | '/onramp/callback'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/onramp/complete'
    | '/onramp/connect-wallet'
    | '/onramp/error'
    | '/onramp/form-entry'
    | '/onramp/initiating'
    | '/onramp/processing'
    | '/onramp'
    | '/onramp/callback'
  id:
    | '__root__'
    | '/_layout'
    | '/_layout/'
    | '/_layout/onramp/complete'
    | '/_layout/onramp/connect-wallet'
    | '/_layout/onramp/error'
    | '/_layout/onramp/form-entry'
    | '/_layout/onramp/initiating'
    | '/_layout/onramp/processing'
    | '/_layout/onramp/'
    | '/_layout/onramp/callback/'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  LayoutRoute: typeof LayoutRouteWithChildren
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_layout': {
      id: '/_layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof LayoutRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/_layout/': {
      id: '/_layout/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof LayoutIndexRouteImport
      parentRoute: typeof LayoutRoute
    }
    '/_layout/onramp/': {
      id: '/_layout/onramp/'
      path: '/onramp'
      fullPath: '/onramp'
      preLoaderRoute: typeof LayoutOnrampIndexRouteImport
      parentRoute: typeof LayoutRoute
    }
    '/_layout/onramp/processing': {
      id: '/_layout/onramp/processing'
      path: '/onramp/processing'
      fullPath: '/onramp/processing'
      preLoaderRoute: typeof LayoutOnrampProcessingRouteImport
      parentRoute: typeof LayoutRoute
    }
    '/_layout/onramp/initiating': {
      id: '/_layout/onramp/initiating'
      path: '/onramp/initiating'
      fullPath: '/onramp/initiating'
      preLoaderRoute: typeof LayoutOnrampInitiatingRouteImport
      parentRoute: typeof LayoutRoute
    }
    '/_layout/onramp/form-entry': {
      id: '/_layout/onramp/form-entry'
      path: '/onramp/form-entry'
      fullPath: '/onramp/form-entry'
      preLoaderRoute: typeof LayoutOnrampFormEntryRouteImport
      parentRoute: typeof LayoutRoute
    }
    '/_layout/onramp/error': {
      id: '/_layout/onramp/error'
      path: '/onramp/error'
      fullPath: '/onramp/error'
      preLoaderRoute: typeof LayoutOnrampErrorRouteImport
      parentRoute: typeof LayoutRoute
    }
    '/_layout/onramp/connect-wallet': {
      id: '/_layout/onramp/connect-wallet'
      path: '/onramp/connect-wallet'
      fullPath: '/onramp/connect-wallet'
      preLoaderRoute: typeof LayoutOnrampConnectWalletRouteImport
      parentRoute: typeof LayoutRoute
    }
    '/_layout/onramp/complete': {
      id: '/_layout/onramp/complete'
      path: '/onramp/complete'
      fullPath: '/onramp/complete'
      preLoaderRoute: typeof LayoutOnrampCompleteRouteImport
      parentRoute: typeof LayoutRoute
    }
    '/_layout/onramp/callback/': {
      id: '/_layout/onramp/callback/'
      path: '/onramp/callback'
      fullPath: '/onramp/callback'
      preLoaderRoute: typeof LayoutOnrampCallbackIndexRouteImport
      parentRoute: typeof LayoutRoute
    }
  }
}

interface LayoutRouteChildren {
  LayoutIndexRoute: typeof LayoutIndexRoute
  LayoutOnrampCompleteRoute: typeof LayoutOnrampCompleteRoute
  LayoutOnrampConnectWalletRoute: typeof LayoutOnrampConnectWalletRoute
  LayoutOnrampErrorRoute: typeof LayoutOnrampErrorRoute
  LayoutOnrampFormEntryRoute: typeof LayoutOnrampFormEntryRoute
  LayoutOnrampInitiatingRoute: typeof LayoutOnrampInitiatingRoute
  LayoutOnrampProcessingRoute: typeof LayoutOnrampProcessingRoute
  LayoutOnrampIndexRoute: typeof LayoutOnrampIndexRoute
  LayoutOnrampCallbackIndexRoute: typeof LayoutOnrampCallbackIndexRoute
}

const LayoutRouteChildren: LayoutRouteChildren = {
  LayoutIndexRoute: LayoutIndexRoute,
  LayoutOnrampCompleteRoute: LayoutOnrampCompleteRoute,
  LayoutOnrampConnectWalletRoute: LayoutOnrampConnectWalletRoute,
  LayoutOnrampErrorRoute: LayoutOnrampErrorRoute,
  LayoutOnrampFormEntryRoute: LayoutOnrampFormEntryRoute,
  LayoutOnrampInitiatingRoute: LayoutOnrampInitiatingRoute,
  LayoutOnrampProcessingRoute: LayoutOnrampProcessingRoute,
  LayoutOnrampIndexRoute: LayoutOnrampIndexRoute,
  LayoutOnrampCallbackIndexRoute: LayoutOnrampCallbackIndexRoute,
}

const LayoutRouteWithChildren =
  LayoutRoute._addFileChildren(LayoutRouteChildren)

const rootRouteChildren: RootRouteChildren = {
  LayoutRoute: LayoutRouteWithChildren,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
