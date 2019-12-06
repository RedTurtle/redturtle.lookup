// @flow
import type { ApiData } from '../types';
import axios from 'axios';

const fetchApi = (data: ApiData) => {
  let { route, params, method = 'GET' } = data;
  let options: {
    method: string,
    url: string,
    params: any,
    auth?: any,
  } = {
    method,
    url: `/${route}`,
    params,
  };

  return axios(options)
    .then(({ data }) => {
      return data;
    })
    .catch(function(error) {
      console.log(error);
    });
};

export const getStatus = () => {
  return fetchApi({
    route: 'status',
  });
};

export const getCacheInfos = () => {
  return fetchApi({
    route: 'cache-infos',
  });
};

export const getSiteProducts = ({ siteId }: { siteId: string }) => {
  return fetchApi({
    route: `${siteId}/products-infos`,
  });
};

export const handleProduct = ({
  siteId,
  productId,
  action,
}: {
  siteId: string,
  productId: string,
  action: string,
}): any => {
  return fetchApi({
    route: `${siteId}/generate-authenticator`,
  })
    .then(({ authenticator }) => {
      const params = {
        _authenticator: authenticator,
        productId,
      };
      return fetchApi({
        route: `${siteId}/${action}-product`,
        method: 'POST',
        params,
      });
    })
    .then(result => {
      if (result.ok) {
        return result;
      }
    });
};

export default fetchApi;
