// @flow
export type ApiData = {
  route: string,
  params?: any,
  method?: string,
};

export type Product = {
  description: string,
  profile_type: string,
  title: string,
  upgrade_info: {
    available: boolean,
    installedVersion: string,
    required: boolean,
    newVersion: string,
    hasProfile: boolean,
  },
  install_profile_id: string,
  version: string,
  uninstall_profile_id: string,
  is_installed: boolean,
  id: string,
};

export type Site = {
  products: {
    available: Array<Product>,
    installed: Array<Product>,
    outdated: Array<Product>,
  },
  id: string,
  title: string,
  url: string,
};

export type AppState = {
  products: Array<Product>,
  sites: Array<Site>,
  authenticator: string,
  isLoading: boolean,
  retrieveStatus: () => any,
};

export type AppProps = {};
