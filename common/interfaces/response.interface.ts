export interface ResponseInterface<T = undefined> {
  message: string;
  data?: T;
}
