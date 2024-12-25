// --------------------1.DTO系列----------------------------
// // 结果格式
export interface LoginDto {
    username: string,
    password: string
    role: string
  }
  // export interface Student {
  //   id: number,
  //   name: string,
  //   sex: string,
  //   age: number
  // }
  
  // // 增、删 dto
  // export interface StudentSaveDto {
  //   name: string,
  //   sex: string,
  //   age: number
  // }
  
  // // 查询 dto
  // export interface StudentQueryDto {
  //   name?: string,
  //   sex?: string | null,
  //   age?: string | null, // 18,20
  //   page: number,
  //   size: number
  // }
  
  // export interface UserInfoDto {
  //   username: string,
  //   name: string,
  //   sex: string
  // }
  
  
  // --------------------2.Resp系列----------------------------
  
  // 如果 spring 错误，返回的对象格式
  export interface SpringError {
    timestamp: string,
    status: number,
    error: string,
    msg: string,
    path: string
  }
  
  // 如果 spring 成功，返回 list 情况
  export interface SpringList<T> {
    data: T[],
    msg?: string,
    code: number
  }
  
  // 如果 spring 成功，返回 page 情况
  export interface SpringPage<T> {
    code: number,
    data: { list: T[], total: number },
    msg?: string
  }
  
  // 如果 spring 成功，返回 Object 情况
  export interface SpringObject<T> {
    code: number,
    data: T,
    msg?: string
  }
  
  // 如果 spring 成功，返回 string 情况
  export interface SpringString {
    data: string,
    msg?: string,
    code: number
  }
  
  // export interface SpringToken {
  //   data: { token: string },
  //   msg?: string,
  //   code: number
  // }

  // 如果 spring 成功，返回 登录相关信息 情况
  export interface SpringMenuAndRoute {
    data: {
      token: string
      routes: Route[],
      menus: Menu[]
    },
    msg?: string,
    code: number
  }
  
  //-------------------------3.泛型T/具体的data--------------------------
  
  export interface Route {
    path: string,
    component: string,
    role: string,
    routeName: string,
    parentRoute: string
  }
  
  export interface Menu {
    id: number,
    // pid: number,
    name: string,
    // icon?: string,
    routePath?: string,
    role: string
    // routeComponent?: string,
    // routeName?: string,
    // routeParentName?: string,
    // children?: Menu[]
  }
  

  
  
  //-------------------------4.AxiosResponse---------------------------
  
  import { AxiosResponse } from 'axios'
  export interface AxiosRespError extends AxiosResponse<SpringError> { }
  export interface AxiosRespList<T> extends AxiosResponse<SpringList<T>> { }
  export interface AxiosRespPage<T> extends AxiosResponse<SpringPage<T>> { }
  export interface AxiosRespString extends AxiosResponse<SpringString> { }
  // export interface AxiosRespToken extends AxiosResponse<SpringToken> { }
  export interface AxiosRespMenuAndRoute extends AxiosResponse<SpringMenuAndRoute> { }
  export interface AxiosRespObject<T> extends AxiosResponse<SpringObject<T>> { }
  