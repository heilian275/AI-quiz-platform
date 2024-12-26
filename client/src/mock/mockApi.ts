import {
  mockUsers,
  mockCustomers,
  mockSalespeople,
  mockContracts,
  mockDeliveries,
  mockPurchases,
} from "./mockData";

// 模拟延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 统一响应格式
const successResponse = (data: any, msg = "操作成功") => ({
  code: 1,
  data,
  msg,
});

const errorResponse = (msg = "操作失败") => ({
  code: 0,
  data: null,
  msg,
});

// 登录接口
export const mockLogin = async (
  username: string,
  password: string,
  role: string
) => {
  await delay(500); // 模拟网络延迟
  const userData = mockUsers[role as keyof typeof mockUsers];

  if (userData && userData.username === username && password === "123456") {
    return successResponse({
      token: userData.token,
      menus: userData.menus,
      routes: userData.routes,
    });
  }
  return errorResponse("用户名或密码错误");
};

// 客户管理接口
export const mockCustomerApi = {
  // 获取客户列表
  getList: async () => {
    await delay(300);
    return successResponse(mockCustomers);
  },

  // 更新客户信息
  update: async (customer: any) => {
    await delay(300);
    const index = mockCustomers.findIndex((c) => c.id === customer.id);
    if (index !== -1) {
      mockCustomers[index] = { ...mockCustomers[index], ...customer };
      return successResponse(null, "更新成功");
    }
    return errorResponse("客户不存在");
  },

  // 添加客户
  add: async (customer: any) => {
    await delay(300);
    const newCustomer = {
      ...customer,
      id: mockCustomers.length + 1,
    };
    mockCustomers.push(newCustomer);
    return successResponse(null, "添加成功");
  },
};

// 销售人员管理接口
export const mockSalespersonApi = {
  // 获取销售人员列表
  getList: async () => {
    await delay(300);
    return successResponse(mockSalespeople);
  },

  // 更新销售人员信息
  update: async (salesperson: any) => {
    await delay(300);
    const index = mockSalespeople.findIndex((s) => s.id === salesperson.id);
    if (index !== -1) {
      mockSalespeople[index] = { ...mockSalespeople[index], ...salesperson };
      return successResponse(null, "更新成功");
    }
    return errorResponse("销售人员不存在");
  },

  // 添加销售人员
  add: async (salesperson: any) => {
    await delay(300);
    const newSalesperson = {
      ...salesperson,
      id: mockSalespeople.length + 1,
    };
    mockSalespeople.push(newSalesperson);
    return successResponse(null, "添加成功");
  },
};

// 合同管理接口
export const mockContractApi = {
  // 获取合同列表
  getList: async () => {
    await delay(300);
    return successResponse(mockContracts);
  },

  // 更新合同
  update: async (contract: any) => {
    await delay(300);
    const index = mockContracts.findIndex((c) => c.id === contract.id);
    if (index !== -1) {
      mockContracts[index] = { ...mockContracts[index], ...contract };
      return successResponse(null, "更新成功");
    }
    return errorResponse("合同不存在");
  },

  // 添加合同
  add: async (contract: any) => {
    await delay(300);
    const newContract = {
      ...contract,
      id: mockContracts.length + 1,
      status: "履行前",
      payStatus: "未支付",
    };
    mockContracts.push(newContract);
    return successResponse(null, "添加成功");
  },

  // 生成发货单
  generateDelivery: async (contractId: number) => {
    await delay(300);
    const contract = mockContracts.find((c) => c.id === contractId);
    if (!contract) return errorResponse("合同不存在");
    if (contract.payStatus !== "已支付") return errorResponse("合同未支付");

    contract.status = "履行中";
    return successResponse(null, "发货单生成成功");
  },
};

// 发货管理接口
export const mockDeliveryApi = {
  // 获取发货单列表
  getList: async () => {
    await delay(300);
    return successResponse(mockDeliveries);
  },

  // 确认发货
  deliver: async (id: number, trackingNumber: string) => {
    await delay(300);
    const delivery = mockDeliveries.find((d) => d.id === id);
    if (delivery) {
      delivery.status = "已发货";
      delivery.trackingNumber = trackingNumber;
      return successResponse("发货成功");
    }
    return errorResponse("发货单不存在");
  },
};

// 进货管理接口
export const mockPurchaseApi = {
  // 获取进货单列表
  getList: async () => {
    await delay(300);
    return successResponse(mockPurchases);
  },

  // 确认进货
  purchase: async (id: number) => {
    await delay(300);
    const purchase = mockPurchases.find((p) => p.id === id);
    if (purchase) {
      purchase.status = "已进货";
      return successResponse("进货成功");
    }
    return errorResponse("进货单不存在");
  },
};
