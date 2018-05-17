// @flow
import base64 from 'base-64';

type ApiData = {
  route: string,
  params?: any,
};

const username = 'admin';
const password = 'admin';
const url = 'http://localhost:8080';

const fetchApi = (data: ApiData) => {
  let { route, params } = data;
  let headers = new Headers();

  headers.append(
    'Authorization',
    'Basic' + base64.encode(username + ':' + password),
  );
  console.log({ ...params, headers, mode: 'no-cors' });
  return fetch(`${url}/${route}`, { ...params, headers, mode: 'no-cors' })
    .then(response => {
      return response.json();
    })
    .catch(function(error) {
      console.log(error);
    });
};

export default fetchApi;
