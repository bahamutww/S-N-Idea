import React, { useState, useCallback } from 'react';
import { evaluateProductIdea } from './services/geminiService';
import { EvaluationResult, EvaluationGrade, AnalysisStatus } from './types';
import { Gauge } from './components/Gauge';
import { DimensionRadar } from './components/RadarChart';
import { ResultCard } from './components/ResultCard';
import { 
  BeakerIcon, 
  ChartBarIcon, 
  LightBulbIcon, 
  ShieldCheckIcon, 
  DocumentMagnifyingGlassIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!inputText.trim()) return;

    setStatus('analyzing'); // Starts the sequence
    setErrorMsg(null);
    setResult(null);

    // Simulate phases for UX since the API call is one big chunk
    const uxTimer1 = setTimeout(() => setStatus('researching'), 1500);
    const uxTimer2 = setTimeout(() => setStatus('scoring'), 3500);

    try {
      const data = await evaluateProductIdea(inputText);
      setResult(data);
      setStatus('complete');
    } catch (err: any) {
      console.error(err);
      setErrorMsg("分析失败，请检查网络或稍后重试。");
      setStatus('error');
    } finally {
      clearTimeout(uxTimer1);
      clearTimeout(uxTimer2);
    }
  }, [inputText]);

  const getGradeColor = (grade: EvaluationGrade) => {
    switch (grade) {
      case EvaluationGrade.EXCELLENT: return 'bg-green-100 text-green-800 border-green-200';
      case EvaluationGrade.POTENTIAL: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case EvaluationGrade.TRASH: return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getGradeLabel = (grade: EvaluationGrade) => {
     switch (grade) {
      case EvaluationGrade.EXCELLENT: return '🦄 牛逼 (优质项目)';
      case EvaluationGrade.POTENTIAL: return '🚀 潜力股 (需打磨)';
      case EvaluationGrade.TRASH: return '🗑️ 垃圾 (风险极高)';
      default: return '未知等级';
    }
  };

  const getStatusText = (s: AnalysisStatus) => {
    switch (s) {
      case 'analyzing': return '正在解构点子...';
      case 'researching': return '正在进行市场调研...';
      case 'scoring': return '正在多维度评分...';
      case 'complete': return '完成';
      case 'error': return '错误';
      default: return '处理中...';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">IdeaValidator AI</h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            产品点子验证助手
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Hero / Input Section */}
        <section className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            几秒钟内验证你的创业点子
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            拒绝盲目。在写第一行代码前，获取客观的市场调研、量化评分和犀利的优化建议。
          </p>

          <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 text-left relative overflow-hidden">
            <div className="relative z-10">
              <label htmlFor="ideaInput" className="block text-sm font-medium text-slate-700 mb-2">
                描述你的产品点子
              </label>
              <textarea
                id="ideaInput"
                rows={4}
                className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow resize-none text-slate-800 placeholder-slate-400"
                placeholder="例如：一个针对养狗人士的优步，提供专业兽医上门遛狗服务，解决专业护理难题..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={status !== 'idle' && status !== 'complete' && status !== 'error'}
              />
              <div className="mt-4 flex justify-between items-center">
                 <p className="text-xs text-slate-500">
                   AI 将自动分析市场规模、竞品和商业可行性。
                 </p>
                 <button
                   onClick={handleSubmit}
                   disabled={!inputText.trim() || (status !== 'idle' && status !== 'complete' && status !== 'error')}
                   className={`px-8 py-3 rounded-lg font-semibold text-white transition-all shadow-md transform hover:scale-105 active:scale-95 flex items-center space-x-2
                     ${(!inputText.trim() || (status !== 'idle' && status !== 'complete' && status !== 'error')) 
                        ? 'bg-slate-400 cursor-not-allowed hover:scale-100' 
                        : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'}`}
                 >
                   {status === 'idle' || status === 'complete' || status === 'error' ? (
                     <>
                       <span>开始验证</span>
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                     </>
                   ) : (
                     <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="capitalize">{getStatusText(status)}</span>
                     </>
                   )}
                 </button>
              </div>
            </div>
          </div>
        </section>

        {/* Error State */}
        {status === 'error' && errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8 text-center">
            {errorMsg}
          </div>
        )}

        {/* Results Section */}
        {result && status === 'complete' && (
          <div className="space-y-8 animate-fade-in-up">
            
            {/* Top Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-8">
                
                {/* Left: Score */}
                <div className="flex-shrink-0 flex flex-col items-center">
                   <Gauge score={result.totalScore} label="综合得分" />
                   <div className={`mt-4 px-4 py-1.5 rounded-full text-sm font-bold border ${getGradeColor(result.grade)}`}>
                     {getGradeLabel(result.grade)}
                   </div>
                </div>

                {/* Right: Summary */}
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">评估结论</h3>
                  <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                    {result.summary}
                  </p>
                  
                  {/* Radar Chart for quick visual */}
                  <div className="mt-6 h-64 w-full border border-slate-100 rounded-xl bg-slate-50">
                    <DimensionRadar data={result.dimensions} />
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Cards */}
            <div className="grid grid-cols-1 gap-6">
              
              <ResultCard 
                title="💡 核心要素拆解" 
                icon={<LightBulbIcon className="w-6 h-6" />}
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">目标用户</h4>
                    <p className="text-slate-800 text-sm">{result.structuredIdea.targetUser}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">核心痛点</h4>
                    <p className="text-slate-800 text-sm">{result.structuredIdea.painPoints}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">解决方案</h4>
                    <p className="text-slate-800 text-sm">{result.structuredIdea.solution}</p>
                  </div>
                   <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">商业模式</h4>
                    <p className="text-slate-800 text-sm">{result.structuredIdea.businessModel}</p>
                  </div>
                </div>
              </ResultCard>

              <ResultCard 
                title="🔍 市场调研与数据" 
                icon={<DocumentMagnifyingGlassIcon className="w-6 h-6" />}
              >
                 <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">市场规模 & 潜力</h4>
                      <p className="text-slate-600 text-sm">{result.research.marketSize}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">主要竞品</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.research.competitors.map((comp, i) => (
                          <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-md border border-slate-200">
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                        <h4 className="font-semibold text-green-900 text-sm mb-1">行业趋势</h4>
                        <p className="text-green-800 text-xs">{result.research.trends}</p>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                        <h4 className="font-semibold text-orange-900 text-sm mb-1">潜在风险</h4>
                        <p className="text-orange-800 text-xs">{result.research.risks}</p>
                      </div>
                    </div>
                 </div>
              </ResultCard>

              <ResultCard 
                title="📊 维度评分详情" 
                icon={<ChartBarIcon className="w-6 h-6" />}
              >
                <div className="space-y-4">
                  {result.dimensions.map((dim, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-4 border-b border-slate-50 last:border-0 pb-4 last:pb-0">
                      <div className="w-full sm:w-1/3 flex items-center justify-between sm:block">
                        <span className="font-medium text-slate-700 block">{dim.name}</span>
                        <div className="flex items-center mt-1">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full w-24 sm:w-full overflow-hidden mr-2">
                            <div 
                              className={`h-full rounded-full ${dim.score > 70 ? 'bg-green-500' : dim.score > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                              style={{ width: `${dim.score}%` }} 
                            />
                          </div>
                          <span className="text-sm font-bold text-slate-900">{dim.score}</span>
                        </div>
                      </div>
                      <div className="w-full sm:w-2/3">
                        <p className="text-sm text-slate-500">{dim.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ResultCard>

              <ResultCard 
                title="🛡️ 优化建议" 
                icon={<ShieldCheckIcon className="w-6 h-6" />}
              >
                <ul className="space-y-3">
                  {result.optimizationAdvice.map((advice, i) => (
                    <li key={i} className="flex items-start gap-3 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-indigo-600 text-white rounded-full text-xs font-bold">
                        {i + 1}
                      </span>
                      <p className="text-indigo-900 text-sm">{advice}</p>
                    </li>
                  ))}
                </ul>
              </ResultCard>

            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;