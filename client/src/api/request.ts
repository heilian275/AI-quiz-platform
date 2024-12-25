import axios, { AxiosHeaders } from "axios";
import { ElMessage } from "element-plus";
import { serverToken } from "../router/index";
import {
  mockLogin,
  mockCustomerApi,
  mockSalespersonApi,
  mockContractApi,
  mockDeliveryApi,
  mockPurchaseApi,
} from "../mock/mockApi";

// 创建 axios 实例
const _axios = axios.create({
  baseURL: "/",
  timeout: 5000,
});

// 是否使用 mock 数据
const useMock = true;

// Mock 请求处理
const handleMockRequest = async (config: any) => {
  const { url, method, data, params } = config;

  // 解析请求数据
  const requestData = method === "get" ? params : JSON.parse(data || "{}");

  // 根据 URL 匹配对应的 mock 处理函数
  if (url === "/api/auth/login") {
    return mockLogin(
      requestData.username,
      requestData.password,
      requestData.role
    );
  }

  if (url === "/api/admin/customer/list") {
    return mockCustomerApi.getList();
  }
  if (url === "/api/admin/customer/update") {
    return mockCustomerApi.update(requestData);
  }
  if (url === "/api/admin/customer/add") {
    return mockCustomerApi.add(requestData);
  }

  if (url === "/api/admin/salesperson/list") {
    return mockSalespersonApi.getList();
  }
  if (url === "/api/admin/salesperson/update") {
    return mockSalespersonApi.update(requestData);
  }
  if (url === "/api/admin/salesperson/add") {
    return mockSalespersonApi.add(requestData);
  }

  if (url === "/api/admin/contract/list") {
    return mockContractApi.getList();
  }
  if (url === "/api/admin/contract/update") {
    return mockContractApi.update(requestData);
  }
  if (url === "/api/admin/contract/add") {
    return mockContractApi.add(requestData);
  }
  if (url.startsWith("/api/admin/shipment/generate/")) {
    const contractId = parseInt(url.split("/").pop() || "0");
    return mockContractApi.generateDelivery(contractId);
  }

  if (url === "/api/ware/delivery/list") {
    return mockDeliveryApi.getList();
  }
  if (url === "/api/ware/deliver") {
    return mockDeliveryApi.deliver(requestData.id, requestData.trackingNumber);
  }

  if (url === "/api/ware/purchase/list") {
    return mockPurchaseApi.getList();
  }
  if (url === "/api/ware/purchase") {
    return mockPurchaseApi.purchase(requestData.id);
  }

  return Promise.reject(new Error("未找到对应的 mock 接口"));
};

// 请求拦截器
_axios.interceptors.request.use(
  async (config) => {
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }
    if (serverToken.value) {
      config.headers.set("Authorization", serverToken.value);
    }

    // 如果使用 mock 数据，拦截请求
    if (useMock) {
      const mockResponse = await handleMockRequest(config);
      return Promise.reject({
        config,
        response: {
          data: mockResponse,
        },
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
_axios.interceptors.response.use(
  (response) => {
    if (response.data.message) {
      ElMessage.success({
        message: response.data.message,
        duration: 3000,
      });
    }
    return response;
  },
  (error) => {
    // 处理 mock 数据的响应
    if (error.response?.data) {
      return Promise.resolve({
        data: error.response.data,
      });
    }

    console.error(error);
    if (error.message) {
      ElMessage.error({
        message: error.message,
        duration: 3000,
      });
    }
    return Promise.reject(error);
  }
);

export default _axios;
