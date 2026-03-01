from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class ArticleBase(BaseModel):
    title: str
    summary: str
    tags: List[str] = []
    published: bool = False


class ArticleCreate(ArticleBase):
    content: str


class ArticleListItem(ArticleBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ArticleDetail(ArticleListItem):
    content: str


class ArticleListResponse(BaseModel):
    items: List[ArticleListItem]
    total: int
    page: int
    size: int
    pages: int
