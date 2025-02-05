export type Endpoint = {
  method: 'get' | 'post';
  path: string;
};

export type Route = {
  basePath: string;
  controller: any;
  children?: SubRoute[];
};

export type SubRoute = {
  path: string;
  controller: any;
  children?: SubRoute[];
};
