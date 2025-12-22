export {};
declare global {
  interface FetchDataPropsTypes {
    limit?: number | string;
    offset?: number | string;
    search?: string;
    status?: number | string | number[];
  }
}
