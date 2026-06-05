import type { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 1,
    title: '数据清洗实战',
    description: '掌握Pandas数据清洗的核心技能，包括处理缺失值、重复值、异常值等关键步骤。',
    difficulty: 'beginner',
    duration: 30,
    dataset: 'retail_orders',
    icon: '🧹',
    objectives: ['学习如何识别和处理缺失值', '掌握删除重复数据的方法', '了解异常值的检测和处理技巧'],
    steps: [
      {
        id: 1,
        title: '加载并查看数据',
        instruction: '首先，让我们加载零售订单数据集并查看其基本信息。',
        initialCode: `import pandas as pd

df = pd.read_csv('retail_orders.csv')
print("数据前5行:")
print(df.head())
print("\\n数据基本信息:")
print(df.info())`,
        hints: ['使用 pd.read_csv() 加载 CSV 文件', 'head() 默认显示前5行'],
      },
      {
        id: 2,
        title: '处理缺失值',
        instruction: '数据中存在一些缺失值。让我们先统计每列的缺失值数量。',
        initialCode: `print("各列缺失值数量:")
print(df.isnull().sum())`,
        hints: ['isnull().sum() 统计每列缺失值', 'fillna() 用于填充缺失值'],
      },
      {
        id: 3,
        title: '删除重复值',
        instruction: '数据中可能存在重复记录。让我们检测并删除这些重复值。',
        initialCode: `print("重复记录数量:", df.duplicated().sum())
df = df.drop_duplicates(keep='first')
print("删除后数据行数:", len(df))`,
        hints: ['duplicated() 返回布尔 Series', 'drop_duplicates() 删除重复行'],
      },
    ],
  },
  {
    id: 2,
    title: '分组聚合分析',
    description: '学习使用Pandas进行数据分组和聚合操作，从多个维度分析数据。',
    difficulty: 'beginner',
    duration: 30,
    dataset: 'retail_orders',
    icon: '📊',
    objectives: ['掌握 groupby 分组操作', '学习多种聚合函数的使用', '了解多级分组和自定义聚合'],
    steps: [
      {
        id: 1,
        title: '基础分组聚合',
        instruction: '让我们按产品类别分组，计算每个类别的订单数量和总金额。',
        initialCode: `import pandas as pd

df = pd.read_csv('retail_orders.csv')
category_stats = df.groupby('category').agg({
    'order_id': 'count',
    'order_amount': 'sum',
}).rename(columns={'order_id': '订单数量', 'order_amount': '总金额'})
print("各产品类别统计:")
print(category_stats)`,
        hints: ['groupby() 创建分组对象', 'agg() 可以同时应用多个聚合函数'],
      },
      {
        id: 2,
        title: '多级分组',
        instruction: '让我们按产品类别和月份进行多级分组分析。',
        initialCode: `df['order_date'] = pd.to_datetime(df['order_date'])
df['month'] = df['order_date'].dt.to_period('M')

monthly_stats = df.groupby(['category', 'month']).agg({
    'order_amount': 'sum',
}).rename(columns={'order_amount': '月销售额'})
print("月度类别统计:")
print(monthly_stats)`,
        hints: ['groupby() 可以传入多个列名', 'dt.to_period() 转换为期间'],
      },
      {
        id: 3,
        title: '自定义聚合',
        instruction: '让我们使用自定义聚合函数来分析数据。',
        initialCode: `def range_agg(x):
    return x.max() - x.min()

stats = df.groupby('category').agg({
    'order_amount': ['mean', 'min', 'max', range_agg],
})
print("类别销售额统计:")
print(stats)`,
        hints: ['可以传入自定义函数', '列表形式指定多个聚合方法'],
      },
    ],
  },
  {
    id: 3,
    title: '购物篮分析',
    description: '通过分析顾客的购买行为，发现商品之间的关联关系。',
    difficulty: 'intermediate',
    duration: 45,
    dataset: 'market_basket',
    icon: '🛒',
    objectives: ['理解购物篮分析的基本概念', '学习商品组合频率统计', '掌握关联规则的计算方法'],
    steps: [
      {
        id: 1,
        title: '加载购物篮数据',
        instruction: '购物篮数据记录了每笔交易中购买的商品。',
        initialCode: `import pandas as pd

df = pd.read_csv('market_basket.csv')
print("数据前10行:")
print(df.head(10))
print(f"\\n总交易数: {df['transaction_id'].nunique()}")
print(f"商品种类: {df['product'].nunique()}")`,
        hints: ['nunique() 计算唯一值数量', 'unique() 返回所有唯一值'],
      },
      {
        id: 2,
        title: '热门商品统计',
        instruction: '让我们统计最常购买的商品。',
        initialCode: `product_counts = df['product'].value_counts().head(10)
print("最受欢迎的商品:")
print(product_counts)`,
        hints: ['value_counts() 统计频率', 'head() 取前N条'],
      },
      {
        id: 3,
        title: '商品组合分析',
        instruction: '让我们找出经常一起购买的商品组合。',
        initialCode: `from itertools import combinations

# 获取每笔交易的商品列表
basket = df.groupby('transaction_id')['product'].apply(list)

# 统计商品组合
pair_counts = {}
for items in basket:
    if len(items) >= 2:
        for pair in combinations(sorted(items), 2):
            pair_counts[pair] = pair_counts.get(pair, 0) + 1

# 排序显示
sorted_pairs = sorted(pair_counts.items(), key=lambda x: x[1], reverse=True)[:10]
print("最常见的商品组合:")
for pair, count in sorted_pairs:
    print(f"{pair}: {count}次")`,
        hints: ['combinations() 生成组合', 'sorted() 排序'],
      },
    ],
  },
  {
    id: 4,
    title: '客户聚类分析',
    description: '使用聚类分析将客户分成不同的群体，制定差异化营销策略。',
    difficulty: 'intermediate',
    duration: 45,
    dataset: 'customer_features',
    icon: '👥',
    objectives: ['理解客户特征数据的结构', '学习数据标准化方法', '掌握K-means聚类的基本应用'],
    steps: [
      {
        id: 1,
        title: '探索客户特征',
        instruction: '让我们加载客户特征数据，了解客户的基本属性。',
        initialCode: `df = pd.read_csv('customer_features.csv')
print("客户数据前5行:")
print(df.head())
print("\\n数据统计信息:")
print(df.describe())`,
        hints: ['describe() 查看数值列的统计信息'],
      },
    ],
  },
  {
    id: 5,
    title: '数据可视化',
    description: '学习使用Matplotlib进行数据可视化。',
    difficulty: 'intermediate',
    duration: 45,
    dataset: 'retail_orders',
    icon: '📈',
    objectives: ['掌握基础图表绘制方法', '学习图表美化技巧', '了解多图表组合展示'],
    steps: [
      {
        id: 1,
        title: '绘制基础图表',
        instruction: '让我们绘制零售订单数据的基础统计图表。',
        initialCode: `import matplotlib.pyplot as plt

df = pd.read_csv('retail_orders.csv')
category_sales = df.groupby('category')['order_amount'].sum().sort_values(ascending=False)

plt.figure(figsize=(10, 6))
plt.bar(category_sales.index, category_sales.values, color='steelblue')
plt.title('各产品类别销售额')
plt.xlabel('产品类别')
plt.ylabel('销售额')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()
print("柱状图已显示")`,
        hints: ['plt.figure() 创建图形', 'plt.bar() 绘制柱状图'],
      },
    ],
  },
  {
    id: 6,
    title: 'A/B测试分析',
    description: '学习如何进行A/B测试分析，评估不同方案的效果差异。',
    difficulty: 'intermediate',
    duration: 45,
    dataset: 'ab_test',
    icon: '🔬',
    objectives: ['理解A/B测试的基本原理', '学习统计显著性检验', '掌握测试结果解读方法'],
    steps: [
      {
        id: 1,
        title: '加载A/B测试数据',
        instruction: 'A/B测试数据记录了两组用户的行为数据。',
        initialCode: `df = pd.read_csv('ab_test.csv')
print("各组样本数量:")
print(df.groupby('group').size())
print("\\n各组转化率:")
print(df.groupby('group')['converted'].mean())`,
        hints: ['groupby() 分组统计', 'mean() 计算转化率'],
      },
    ],
  },
  {
    id: 7,
    title: '时间序列分析',
    description: '学习时间序列分析的基本方法，发现数据的趋势和季节性模式。',
    difficulty: 'intermediate',
    duration: 45,
    dataset: 'time_series_sales',
    icon: '⏰',
    objectives: ['理解时间序列数据的结构', '学习趋势和季节性分解', '掌握简单预测方法'],
    steps: [
      {
        id: 1,
        title: '加载时间序列数据',
        instruction: '时间序列数据记录了随时间变化的销售数据。',
        initialCode: `df = pd.read_csv('time_series_sales.csv')
df['date'] = pd.to_datetime(df['date'])
df = df.set_index('date')
print("时间序列数据前10行:")
print(df.head(10))`,
        hints: ['pd.to_datetime() 转换日期类型', 'set_index() 设置日期索引'],
      },
    ],
  },
  {
    id: 8,
    title: '特征工程',
    description: '学习特征工程的核心技术，提高机器学习模型的性能。',
    difficulty: 'advanced',
    duration: 60,
    dataset: 'customer_features',
    icon: '🔧',
    objectives: ['理解特征工程的重要性', '学习特征创建和变换方法', '掌握特征选择技巧'],
    steps: [
      {
        id: 1,
        title: '探索原始特征',
        instruction: '特征工程是提升模型性能的关键。',
        initialCode: `df = pd.read_csv('customer_features.csv')
print("原始特征:")
print(df.columns.tolist())
print("\\n特征统计信息:")
print(df.describe())`,
        hints: ['describe() 查看统计信息'],
      },
    ],
  },
  {
    id: 9,
    title: '异常值检测',
    description: '学习异常值检测的方法，保证数据质量。',
    difficulty: 'advanced',
    duration: 45,
    dataset: 'customer_features',
    icon: '🎯',
    objectives: ['理解异常值的定义和影响', '学习多种异常值检测方法', '掌握异常值处理策略'],
    steps: [
      {
        id: 1,
        title: '统计方法检测异常值',
        instruction: '让我们使用统计方法检测数据中的异常值。',
        initialCode: `df = pd.read_csv('customer_features.csv')

def detect_outliers_iqr(data, column):
    Q1 = data[column].quantile(0.25)
    Q3 = data[column].quantile(0.75)
    IQR = Q3 - Q1
    lower = Q1 - 1.5 * IQR
    upper = Q3 + 1.5 * IQR
    outliers = data[(data[column] < lower) | (data[column] > upper)]
    return len(outliers), lower, upper

outliers, lower, upper = detect_outliers_iqr(df, 'annual_income')
print(f"年收入异常值数量: {outliers}")
print(f"正常范围: [{lower:.2f}, {upper:.2f}]")`,
        hints: ['IQR方法检测异常值'],
      },
    ],
  },
  {
    id: 10,
    title: '多数据集合并',
    description: '学习如何合并多个数据集，整合不同来源的信息。',
    difficulty: 'intermediate',
    duration: 45,
    dataset: 'retail_orders',
    icon: '🔗',
    objectives: ['掌握不同类型的合并操作', '学习处理合并中的冲突', '了解数据整合的最佳实践'],
    steps: [
      {
        id: 1,
        title: '合并数据集',
        instruction: '让我们演示如何合并两个数据集。',
        initialCode: `orders = pd.read_csv('retail_orders.csv')

customers = pd.DataFrame({
    'customer_id': orders['customer_id'].unique()[:20],
    'customer_name': ['客户' + str(i) for i in range(20)],
    'level': ['VIP', '普通'] * 10
})

result = pd.merge(orders, customers, on='customer_id', how='left')
print("合并后数据:")
print(result.head())`,
        hints: ['merge() 合并数据集', 'how 参数指定连接方式'],
      },
    ],
  },
];

export function getProjectById(id: number): Project | undefined {
  return projects.find(p => p.id === id);
}
