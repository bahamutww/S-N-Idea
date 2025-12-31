import { GoogleGenAI } from "@google/genai";
import { EvaluationResult, EvaluationGrade } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const evaluateProductIdea = async (ideaText: string): Promise<EvaluationResult> => {
  const modelId = "gemini-3-pro-preview";

  const systemPrompt = `
    你是一位世界级的产品经理和风险投资家。
    你的工作是以极度客观、数据驱动和逻辑严密的方式验证、调研并对产品点子进行评分。

    你需要执行以下步骤：
    1. **结构化 (Structure)**: 将用户输入的原始点子提炼为结构化信息（目标用户、核心痛点、解决方案、商业模式）。
    2. **调研 (Research)**: 利用你的知识库（模拟市场调研）预估市场规模、识别现实中的竞品、发现行业趋势。
    3. **评测 (Evaluate)**: 从5个维度对点子进行打分（0-100分）：
       - 市场需求 (Market Demand): 问题是否真实且巨大？
       - 创新性 (Innovation): 是否独特？
       - 可行性 (Feasibility): 技术和运营是否可行？
       - 竞争壁垒 (Competitive Moat): 是否容易被复制？
       - 商业价值 (Commercial Viability): 能否赚钱？
    4. **计算 (Calculate)**: 计算加权平均总分。
    5. **分级 (Classify)**:
       - 'EXCELLENT' (牛逼): 总分 >= 80 (独角兽潜力/强烈推荐)
       - 'POTENTIAL' (潜力股): 40 <= 总分 < 80 (不错但需要打磨)
       - 'TRASH' (垃圾): 总分 < 40 (逻辑硬伤、红海市场或不可行)
    6. **建议 (Advise)**: 提供3-5条具体、可执行的优化建议，帮助规避风险。

    **响应格式**:
    你必须只返回一个有效的 JSON 对象。不要包含 markdown 代码块。**所有内容值必须是简体中文**。
    JSON 结构必须严格匹配以下字段（Key保持英文，Value为中文）：
    {
      "structuredIdea": {
        "targetUser": "...",
        "painPoints": "...",
        "solution": "...",
        "businessModel": "..."
      },
      "research": {
        "marketSize": "...",
        "competitors": ["竞品1", "竞品2", ...],
        "trends": "...",
        "risks": "..."
      },
      "dimensions": [
        { "name": "市场需求", "score": 85, "reason": "..." },
        { "name": "创新性", "score": 60, "reason": "..." },
        { "name": "可行性", "score": 90, "reason": "..." },
        { "name": "竞争壁垒", "score": 40, "reason": "..." },
        { "name": "商业价值", "score": 75, "reason": "..." }
      ],
      "totalScore": 70,
      "grade": "POTENTIAL",
      "summary": "...",
      "optimizationAdvice": ["建议 1", "建议 2", "建议 3"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `请分析这个产品点子: "${ideaText}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }] // Enable Google Search for market research
      },
    });

    const text = response.text;
    if (!text) throw new Error("AI 未返回结果");

    // Clean potential markdown fencing if the model ignores the mime type slightly (rare but safe)
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const data = JSON.parse(cleanedText);
    
    // Ensure grade matches enum
    let grade = EvaluationGrade.POTENTIAL;
    if (data.totalScore >= 80) grade = EvaluationGrade.EXCELLENT;
    else if (data.totalScore < 40) grade = EvaluationGrade.TRASH;
    else grade = EvaluationGrade.POTENTIAL;

    // Overwrite grade to be safe from model hallucination
    data.grade = grade;

    return data as EvaluationResult;
  } catch (error) {
    console.error("Evaluation failed:", error);
    throw error;
  }
};