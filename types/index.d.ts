interface IAuthInfo {
  user: IUser;
  accessToken?: string;
  refreshToken?: string;
}
interface IResponseBody<T> {
  code: number;
  error?: string | null;
  message: string;
  data: T;
}

interface PagingMeta {
  /** 本页记录数 */
  itemCount: number;
  /** 总记录数 */
  totalItems: number;
  /** 每页请求几页 */
  itemsPerPage: number;
  /** 总页数 */
  totalPages: number;
  /** 当前第几页 */
  currentPage: number;
}

interface PagingLinks {
  first: string;
  previous: string;
  next: string;
  last: string;
}
interface IResponseBodyByPaging<T> {
  success: boolean;
  message: string;
  data: T[];
  meta?: PagingMeta;
  links?: PagingLinks;
}

interface PagingParams {
  page: string;
  pageSize: string;
}

interface IMockData {
  mtime: number;
  score: number; // 随机生成1-800的数字
  rank: number; // 随机生成1-100的数字
  stars: number; // 随机生成1-5的数字
  nickname: string; // 随机生成中文名字
}

interface IMockUser {
  title: string;
  name: string;
  url: string;
  date: string;
}
