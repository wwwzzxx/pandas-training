import type { Dataset } from '@/types';

export const datasets: Record<string, Dataset> = {
  retail_orders: {
    name: '零售订单数据',
    filename: 'retail_orders.csv',
    description: '包含零售订单的详细信息，包括订单ID、客户ID、产品类别、订单金额、数量、地区和日期等字段。',
    columns: [
      { name: 'order_id', type: 'int', description: '订单唯一标识' },
      { name: 'customer_id', type: 'int', description: '客户唯一标识' },
      { name: 'category', type: 'string', description: '产品类别' },
      { name: 'order_amount', type: 'float', description: '订单金额' },
      { name: 'quantity', type: 'int', description: '购买数量' },
      { name: 'region', type: 'string', description: '销售地区' },
      { name: 'order_date', type: 'date', description: '订单日期' },
    ],
    sampleData: `order_id,customer_id,category,order_amount,quantity,region,order_date
1,101,电子,299.99,2,华东,2024-01-15
2,102,服装,89.50,1,华北,2024-01-16
3,103,食品,45.00,3,华南,2024-01-17
4,101,电子,599.99,1,华东,2024-01-18
5,104,服装,120.00,2,西南,2024-01-19
6,105,食品,78.50,4,华东,2024-01-20
7,102,电子,450.00,1,华北,2024-01-21
8,106,服装,65.00,1,华南,2024-01-22`,
  },
  market_basket: {
    name: '购物篮数据',
    filename: 'market_basket.csv',
    description: '记录每笔交易中购买的商品信息，用于分析商品之间的关联关系。',
    columns: [
      { name: 'transaction_id', type: 'int', description: '交易唯一标识' },
      { name: 'product', type: 'string', description: '购买的商品名称' },
    ],
    sampleData: `transaction_id,product
1,牛奶
1,面包
1,鸡蛋
2,牛奶
2,咖啡
3,面包
3,黄油
3,鸡蛋
4,牛奶
4,面包
4,咖啡
5,鸡蛋
5,黄油`,
  },
  customer_features: {
    name: '客户特征数据',
    filename: 'customer_features.csv',
    description: '包含客户的基本信息和消费行为特征，用于客户分析和聚类。',
    columns: [
      { name: 'customer_id', type: 'int', description: '客户唯一标识' },
      { name: 'age', type: 'int', description: '客户年龄' },
      { name: 'annual_income', type: 'float', description: '年收入' },
      { name: 'purchase_frequency', type: 'int', description: '购买频率（月）' },
      { name: 'avg_order_value', type: 'float', description: '平均订单金额' },
      { name: 'total_spend', type: 'float', description: '总消费金额' },
    ],
    sampleData: `customer_id,age,annual_income,purchase_frequency,avg_order_value,total_spend
1,25,35000,5,85.5,427.5
2,34,55000,8,120.0,960.0
3,45,75000,12,150.5,1806.0
4,28,42000,6,95.0,570.0
5,52,95000,15,200.0,3000.0
6,31,48000,7,110.0,770.0
7,38,62000,10,135.0,1350.0
8,42,70000,11,145.0,1595.0`,
  },
  ab_test: {
    name: 'A/B测试数据',
    filename: 'ab_test.csv',
    description: '记录A/B测试中两组用户的转化情况，用于评估方案效果。',
    columns: [
      { name: 'user_id', type: 'int', description: '用户唯一标识' },
      { name: 'group', type: 'string', description: '测试分组（A或B）' },
      { name: 'converted', type: 'int', description: '是否转化（0或1）' },
    ],
    sampleData: `user_id,group,converted
1,A,0
2,A,1
3,A,0
4,A,0
5,A,1
6,B,1
7,B,0
8,B,1
9,B,1
10,B,0`,
  },
  time_series_sales: {
    name: '时间序列销售数据',
    filename: 'time_series_sales.csv',
    description: '记录每日销售数据，用于时间序列分析和预测。',
    columns: [
      { name: 'date', type: 'date', description: '日期' },
      { name: 'sales', type: 'float', description: '销售额' },
    ],
    sampleData: `date,sales
2024-01-01,1200.5
2024-01-02,1350.0
2024-01-03,980.5
2024-01-04,1450.0
2024-01-05,1100.0
2024-01-06,1250.5
2024-01-07,1380.0
2024-01-08,1520.5`,
  },
};

export function getDataset(name: string): Dataset | undefined {
  return datasets[name];
}
