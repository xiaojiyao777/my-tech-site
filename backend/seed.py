"""
Run: python seed.py
Inserts 3 sample articles into the database.
"""
import asyncio
import uuid
from app.database import AsyncSessionLocal, init_db
from app.models.article import Article


async def seed():
    await init_db()
    async with AsyncSessionLocal() as db:
        articles = [
            Article(
                id=str(uuid.uuid4()),
                title="从零理解 Transformer 架构",
                summary="深入剖析 Attention 机制与 Transformer 的核心设计原理，跟随 Karpathy 的思路从头实现。",
                content="## 前言\n\nTransformer 架构自 2017 年 Attention is All You Need 论文发布以来，彻底改变了 NLP 领域...",
                tags=["LLM", "Transformer", "Deep Learning"],
                published=True,
            ),
            Article(
                id=str(uuid.uuid4()),
                title="运筹优化与 LLM 的融合实践",
                summary="探索如何将传统的运筹研究（OR）方法与大语言模型结合，解决复杂调度和规划问题。",
                content="## 背景\n\n运筹学作为一门成熟的学科，在供应链、能源调度等领域有着广泛应用...",
                tags=["Operations Research", "LLM", "Optimization"],
                published=True,
            ),
            Article(
                id=str(uuid.uuid4()),
                title="OpenClaw + Claude Code 构建个人 AI 开发团队",
                summary="记录如何利用 OpenClaw 编排多个 AI Agent，打造一套自动化的全栈开发流水线。",
                content="## 动机\n\n当一个人需要同时承担架构师、前端、后端、测试的职责时，AI Agent 军团是最好的解法...",
                tags=["Agent", "OpenClaw", "Automation"],
                published=True,
            ),
        ]
        db.add_all(articles)
        await db.commit()
        print(f"✅ Seeded {len(articles)} articles.")


if __name__ == "__main__":
    asyncio.run(seed())
