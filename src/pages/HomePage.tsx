import { projects } from '@/data/projects';
import { ProjectCard } from '@/components/ProjectCard';
import { useProgressStore } from '@/store/progressStore';
import { BookOpen, Code, Database, Award, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HomePage() {
  const { getProgress } = useProgressStore();

  const features = [
    { icon: Database, title: '真实数据集', description: '基于真实场景的数据集' },
    { icon: Code, title: '实时运行', description: '无需安装环境，浏览器直接运行' },
    { icon: BookOpen, title: '循序渐进', description: '从入门到进阶，10个精选项目' },
    { icon: Award, title: '徽章认证', description: '完成项目获取徽章' },
  ];

  const completedCount = projects.filter(p => getProgress(p.id)?.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />实战课程 · 无需安装
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Pandas 数据分析<span className="block text-indigo-600">实战训练营</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              10个精选实战项目，从入门到进阶<br />完全在浏览器中运行代码
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm">
                  <f.icon className="w-5 h-5 text-indigo-500" />
                  <span className="text-gray-700">{f.title}</span>
                </div>
              ))}
            </div>
            {completedCount > 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-lg text-emerald-700">
                <Award className="w-5 h-5" />已完成 {completedCount} 个项目
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">精选项目</h2>
            <p className="text-gray-600">选择一个项目开始你的学习之旅 · 共 {projects.length} 个项目</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} progress={getProgress(project.id)} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">开始你的数据分析之旅</h2>
          <p className="text-indigo-100 mb-8">无需任何安装，点击上方项目卡片即可开始练习</p>
          <Link to="/project/1" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
            开始第一个项目<ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
