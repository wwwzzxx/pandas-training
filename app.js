import { loadPyodide } from 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';

let pyodide;
let outputDiv;
let codeInput;
let runBtn;
let clearBtn;
let exampleBtn;

const exampleCodes = {
    basic: `# Python基础示例
print("欢迎来到WZX Python学习平台！")
print("这是一个基于浏览器的Python运行环境")

# 变量和数据类型
name = "WZX"
age = 20
gpa = 3.85
is_student = True

print(f"\\n姓名: {name}")
print(f"年龄: {age}")
print(f"GPA: {gpa}")
print(f"学生身份: {is_student}")

# 列表操作
skills = ["Python", "Excel", "SQL", "Tableau"]
print(f"\\n技能列表: {skills}")
print(f"技能数量: {len(skills)}")

# 循环和条件
print("\\n技能评级:")
for skill in skills:
    if skill == "Python":
        print(f"  {skill}: ⭐⭐⭐⭐⭐")
    else:
        print(f"  {skill}: ⭐⭐⭐⭐")`,
    
    pandas: `# Pandas数据处理示例
import pandas as pd

# 创建DataFrame
data = {
    '姓名': ['张三', '李四', '王五', '赵六'],
    '专业': ['数据分析', '商务智能', '数据分析', '市场营销'],
    '成绩': [92, 88, 95, 85],
    '奖学金': [True, False, True, False]
}

df = pd.DataFrame(data)
print("原始数据:")
print(df)

print("\\n统计信息:")
print(df.describe())

print("\\n成绩排名:")
print(df.sort_values('成绩', ascending=False))

print("\\n获得奖学金的学生:")
print(df[df['奖学金'] == True])`,

    matplotlib: `# Matplotlib数据可视化
import matplotlib.pyplot as plt
import numpy as np

# 设置中文支持
plt.rcParams['font.sans-serif'] = ['SimHei', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False

# 生成数据
months = ['1月', '2月', '3月', '4月', '5月', '6月']
sales = [120, 150, 180, 220, 190, 250]
profit = [24, 30, 36, 44, 38, 50]

# 创建图表
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(8, 6))

ax1.bar(months, sales, color='#667eea')
ax1.set_title('月度销售额')
ax1.set_ylabel('销售额(万元)')
ax1.grid(axis='y', linestyle='--', alpha=0.7)

ax2.plot(months, profit, marker='o', color='#4ecdc4', linewidth=2)
ax2.set_title('月度利润')
ax2.set_ylabel('利润(万元)')
ax2.grid(axis='y', linestyle='--', alpha=0.7)

plt.tight_layout()

# 保存图表到内存
from io import BytesIO
buf = BytesIO()
plt.savefig(buf, format='png', dpi=100)
buf.seek(0)

import base64
img_data = base64.b64encode(buf.read()).decode('utf-8')
print(f"PLOT_IMAGE:{img_data}")
print("图表已生成！")`,

    analysis: `# 综合数据分析示例
import pandas as pd
import numpy as np

# 模拟销售数据
np.random.seed(42)
dates = pd.date_range(start='2025-01-01', end='2025-06-30', freq='D')
regions = ['华南', '华东', '华北', '西南']

data = {
    '日期': np.random.choice(dates, 500),
    '地区': np.random.choice(regions, 500),
    '销售额': np.random.randint(500, 5000, 500),
    '订单量': np.random.randint(1, 50, 500)
}

df = pd.DataFrame(data)
df['日期'] = pd.to_datetime(df['日期'])
df['月份'] = df['日期'].dt.month

print("数据概览:")
print(df.head())

print("\\n各地区销售统计:")
region_stats = df.groupby('地区')['销售额'].agg(['sum', 'mean', 'max'])
print(region_stats)

print("\\n月度销售趋势:")
monthly_stats = df.groupby('月份')['销售额'].sum()
print(monthly_stats)

print("\\n日均订单量:")
daily_avg = df['订单量'].mean()
print(f"日均订单量: {daily_avg:.1f}单")`
};

async function init() {
    outputDiv = document.getElementById('output');
    codeInput = document.getElementById('code-input');
    runBtn = document.getElementById('run-btn');
    clearBtn = document.getElementById('clear-btn');
    exampleBtn = document.getElementById('example-btn');

    runBtn.addEventListener('click', runCode);
    clearBtn.addEventListener('click', clearCode);
    exampleBtn.addEventListener('click', showExampleMenu);

    outputDiv.innerHTML = '<span class="loading">正在初始化Python环境...</span>';
    
    try {
        pyodide = await loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
        });
        
        await pyodide.loadPackage(['pandas', 'matplotlib', 'numpy']);
        
        outputDiv.innerHTML = '<span class="success">✅ Python环境已就绪！点击"运行代码"按钮开始执行。</span>';
        runBtn.disabled = false;
    } catch (error) {
        outputDiv.innerHTML = `<span class="error">❌ 初始化失败: ${error.message}</span>`;
        console.error('Pyodide init error:', error);
    }
}

async function runCode() {
    const code = codeInput.value;
    if (!code.trim()) {
        outputDiv.innerHTML = '<span class="error">❌ 请输入Python代码</span>';
        return;
    }

    runBtn.disabled = true;
    outputDiv.innerHTML = '<span class="loading">⏳ 正在执行代码...</span>';

    try {
        let output = '';
        const originalPrint = pyodide.globals.get('print');
        
        pyodide.globals.set('print', (...args) => {
            const str = args.map(arg => {
                if (arg === null) return 'None';
                if (arg === undefined) return 'undefined';
                return String(arg);
            }).join(' ');
            output += str + '\n';
        });

        await pyodide.runAsync(code);
        
        pyodide.globals.set('print', originalPrint);

        if (output.includes('PLOT_IMAGE:')) {
            const imgData = output.split('PLOT_IMAGE:')[1].split('\n')[0];
            displayPlot(imgData);
            output = output.replace(/PLOT_IMAGE:[^\n]*/g, '');
        }
        
        outputDiv.innerHTML = output || '<span class="success">✅ 代码执行完成</span>';
    } catch (error) {
        outputDiv.innerHTML = `<span class="error">❌ 执行错误: ${error.message}</span>`;
        console.error('Execution error:', error);
    } finally {
        runBtn.disabled = false;
    }
}

function displayPlot(imgData) {
    const plotContainer = document.createElement('div');
    plotContainer.style.cssText = `
        margin-top: 1rem;
        padding: 1rem;
        background: #2d2d2d;
        border-radius: 8px;
        text-align: center;
    `;
    const img = document.createElement('img');
    img.src = `data:image/png;base64,${imgData}`;
    img.style.maxWidth = '100%';
    img.style.borderRadius = '4px';
    plotContainer.appendChild(img);
    outputDiv.appendChild(plotContainer);
}

function clearCode() {
    codeInput.value = '';
    outputDiv.innerHTML = '点击"运行代码"按钮开始执行...';
}

function showExampleMenu() {
    const menu = document.createElement('div');
    menu.style.cssText = `
        position: absolute;
        background: white;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        padding: 0.5rem;
        z-index: 100;
        min-width: 180px;
    `;
    
    const examples = [
        { key: 'basic', label: '基础语法' },
        { key: 'pandas', label: 'Pandas数据处理' },
        { key: 'matplotlib', label: 'Matplotlib可视化' },
        { key: 'analysis', label: '综合数据分析' }
    ];
    
    examples.forEach(example => {
        const item = document.createElement('button');
        item.textContent = example.label;
        item.style.cssText = `
            display: block;
            width: 100%;
            padding: 0.5rem 1rem;
            text-align: left;
            border: none;
            background: none;
            cursor: pointer;
            border-radius: 4px;
            transition: background 0.2s;
        `;
        item.onmouseenter = () => item.style.background = '#f8f9fa';
        item.onclick = () => {
            codeInput.value = exampleCodes[example.key];
            menu.remove();
        };
        menu.appendChild(item);
    });
    
    exampleBtn.parentNode.appendChild(menu);
    
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target)) {
            menu.remove();
        }
    }, { once: true });
}

document.addEventListener('DOMContentLoaded', init);

document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    });
});