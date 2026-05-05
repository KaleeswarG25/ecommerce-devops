from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List
import sqlalchemy as sa
from app.database import get_db
from app.models import User, Product, Order
from app.schemas import UserResponse, ProductResponse
from app.auth.dependencies import get_current_admin_user

router = APIRouter()

@router.get("/users", response_model=List[UserResponse])
async def get_all_users(
    current_user: dict = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User))
    users = result.scalars().all()
    return [UserResponse.from_orm(user) for user in users]

@router.get("/products", response_model=List[ProductResponse])
async def get_all_products_admin(
    current_user: dict = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Product))
    products = result.scalars().all()
    return [ProductResponse.from_orm(product) for product in products]

@router.get("/stats")
async def get_admin_stats(
    current_user: dict = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    # Get user count
    user_result = await db.execute(sa.select(func.count(User.id)))
    user_count = user_result.scalar()

    # Get product count
    product_result = await db.execute(sa.select(func.count(Product.id)))
    product_count = product_result.scalar()

    # Get order count
    order_result = await db.execute(sa.select(func.count(Order.id)))
    order_count = order_result.scalar()

    # Get total revenue
    revenue_result = await db.execute(sa.select(func.sum(Order.total_amount)))
    total_revenue = revenue_result.scalar() or 0

    return {
        "total_users": user_count,
        "total_products": product_count,
        "total_orders": order_count,
        "total_revenue": total_revenue
    }