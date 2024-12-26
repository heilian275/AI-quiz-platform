// 模拟用户数据
export const mockUsers = {
  sale_sperson: {
    username: "sales1",
    userId: 1,
    token: "mock-token-sales",
    menus: [
      {
        id: 1,
        name: "合同执行情况",
        routePath: "/sales/execution",
        role: "sale_sperson",
      },
      {
        id: 2,
        name: "销售业绩查询",
        routePath: "/sales-performance",
        role: "sale_sperson",
      },
    ],
    routes: [
      {
        path: "/sales/execution",
        component: "SalesExecution",
        role: "sale_sperson",
        routeName: "salesExecution",
        parentRoute: "main",
      },
      {
        path: "/sales-performance",
        component: "SalesPerformance",
        role: "sale_sperson",
        routeName: "salesPerformance",
        parentRoute: "main",
      },
    ],
  },
  sales_administrator: {
    username: "admin1",
    userId: 2,
    token: "mock-token-admin",
    menus: [
      {
        id: 3,
        name: "客户管理",
        routePath: "/customer-list",
        role: "sales_administrator",
      },
      {
        id: 4,
        name: "销售人员管理",
        routePath: "/salesperson-list",
        role: "sales_administrator",
      },
      {
        id: 5,
        name: "合同管理",
        routePath: "/contract-list",
        role: "sales_administrator",
      },
    ],
    routes: [
      {
        path: "/customer-list",
        component: "CustomerList",
        role: "sales_administrator",
        routeName: "customerList",
        parentRoute: "main",
      },
      {
        path: "/salesperson-list",
        component: "SalesPersonList",
        role: "sales_administrator",
        routeName: "salespersonList",
        parentRoute: "main",
      },
      {
        path: "/contract-list",
        component: "ContractList",
        role: "sales_administrator",
        routeName: "contractList",
        parentRoute: "main",
      },
    ],
  },
  warehouse_keeper: {
    username: "warehouse1",
    userId: 3,
    token: "mock-token-warehouse",
    menus: [
      {
        id: 6,
        name: "发货管理",
        routePath: "/delivery-list",
        role: "warehouse_keeper",
      },
      {
        id: 7,
        name: "进货管理",
        routePath: "/purchase-list",
        role: "warehouse_keeper",
      },
    ],
    routes: [
      {
        path: "/delivery-list",
        component: "DeliveryList",
        role: "warehouse_keeper",
        routeName: "deliveryList",
        parentRoute: "main",
      },
      {
        path: "/purchase-list",
        component: "PurchaseList",
        role: "warehouse_keeper",
        routeName: "purchaseList",
        parentRoute: "main",
      },
    ],
  },
};

// 模拟客户数据
export const mockCustomers = [
  { id: 1, name: "张三", telegram: "13800138000" },
  { id: 2, name: "李四", telegram: "13900139000" },
  { id: 3, name: "王五", telegram: "13700137000" },
];

// 模拟销售人员数据
export const mockSalespeople = [
  { id: 1, name: "销售A", password: "123456", telegram: "13600136000" },
  { id: 2, name: "销售B", password: "123456", telegram: "13500135000" },
];

// 模拟合同数据
export const mockContracts = [
  {
    id: 1,
    customerName: "张三",
    salespersonName: "销售A",
    amount: 10000,
    status: "履行前",
    payStatus: "未支付",
    productList: [
      { productName: "产品A", quantity: 2 },
      { productName: "产品B", quantity: 3 },
    ],
  },
  {
    id: 2,
    customerName: "李四",
    salespersonName: "销售B",
    amount: 20000,
    status: "履行中",
    payStatus: "已支付",
    productList: [
      { productName: "产品C", quantity: 1 },
      { productName: "产品D", quantity: 4 },
    ],
  },
];

// 模拟发货单数据
export const mockDeliveries = [
  {
    id: 1,
    productName: "产品A",
    quantity: 2,
    status: "未发货",
  },
  {
    id: 2,
    productName: "产品B",
    quantity: 3,
    status: "已发货",
    trackingNumber: "SF1234567",
  },
];

// 模拟进货单数据
export const mockPurchases = [
  {
    id: 1,
    productName: "产品A",
    quantity: 100,
    status: "未进货",
  },
  {
    id: 2,
    productName: "产品B",
    quantity: 200,
    status: "已进货",
  },
];
