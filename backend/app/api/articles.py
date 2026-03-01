from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from app.database import get_db
from app.models.article import Article
from app.schemas.article import ArticleListResponse, ArticleDetail, ArticleListItem
import math

router = APIRouter(prefix="/articles", tags=["articles"])


@router.get("", response_model=ArticleListResponse)
async def list_articles(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    offset = (page - 1) * size

    count_stmt = select(func.count()).select_from(Article).where(Article.published == True)
    total_result = await db.execute(count_stmt)
    total = total_result.scalar_one()

    stmt = (
        select(Article)
        .where(Article.published == True)
        .order_by(Article.created_at.desc())
        .offset(offset)
        .limit(size)
    )
    result = await db.execute(stmt)
    articles = result.scalars().all()

    return ArticleListResponse(
        items=[ArticleListItem.model_validate(a) for a in articles],
        total=total,
        page=page,
        size=size,
        pages=math.ceil(total / size) if total > 0 else 0,
    )


@router.get("/{article_id}", response_model=ArticleDetail)
async def get_article(article_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Article).where(
        and_(Article.id == article_id, Article.published == True)
    )
    result = await db.execute(stmt)
    article = result.scalar_one_or_none()

    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    return ArticleDetail.model_validate(article)
