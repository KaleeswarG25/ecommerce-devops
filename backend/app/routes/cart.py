from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List
import sqlalchemy as sa
from app.database import get_db, redis_client
from app.models import Cart, Product, User
from app.schemas import CartItemCreate, CartItemResponse, CartResponse
from app.auth.dependencies import get_current_user
from decimal import Decimal

router = APIRouter()

@router.get("/", response_model=CartResponse)
async def get_cart(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Get cart items with product details
    result = await db.execute(
        select(Cart, Product)
        .join(Product, Cart.product_id == Product.id)
        .where(Cart.user_id == current_user.id, Product.is_active == True)
    )

    items = []
    total_amount = Decimal('0.00')

    for cart_item, product in result:
        item_response = CartItemResponse(
            id=cart_item.id,
            user_id=cart_item.user_id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity,
            product_name=product.name,
            product_price=Decimal(str(product.price))
        )
        items.append(item_response)
        total_amount += item_response.product_price * item_response.quantity

    return CartResponse(
        items=items,
        total_items=len(items),
        total_amount=total_amount
    )

@router.post("/items", response_model=CartItemResponse)
async def add_to_cart(
    cart_data: CartItemCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Check if product exists and is active
    result = await db.execute(
        select(Product).where(Product.id == cart_data.product_id, Product.is_active == True)
    )
    product = result.scalar_one_or_none()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    # Check if item already in cart
    result = await db.execute(
        select(Cart).where(Cart.user_id == current_user.id, Cart.product_id == cart_data.product_id)
    )
    existing_item = result.scalar_one_or_none()

    if existing_item:
        # Update quantity
        existing_item.quantity += cart_data.quantity
        await db.commit()
        await db.refresh(existing_item)
        cart_item = existing_item
    else:
        # Create new cart item
        cart_item = Cart(
            user_id=current_user.id,
            product_id=cart_data.product_id,
            quantity=cart_data.quantity
        )
        db.add(cart_item)
        await db.commit()
        await db.refresh(cart_item)

    return CartItemResponse(
        id=cart_item.id,
        user_id=cart_item.user_id,
        product_id=cart_item.product_id,
        quantity=cart_item.quantity,
        product_name=product.name,
        product_price=Decimal(str(product.price))
    )

@router.put("/items/{item_id}")
async def update_cart_item(
    item_id: int,
    quantity: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if quantity <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Quantity must be greater than 0"
        )

    result = await db.execute(
        select(Cart).where(Cart.id == item_id, Cart.user_id == current_user.id)
    )
    cart_item = result.scalar_one_or_none()

    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found"
        )

    cart_item.quantity = quantity
    await db.commit()

    return {"message": "Cart item updated successfully"}

@router.delete("/items/{item_id}")
async def remove_from_cart(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Cart).where(Cart.id == item_id, Cart.user_id == current_user.id)
    )
    cart_item = result.scalar_one_or_none()

    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found"
        )

    await db.delete(cart_item)
    await db.commit()

    return {"message": "Item removed from cart"}

@router.delete("/")
async def clear_cart(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    await db.execute(
        sa.delete(Cart).where(Cart.user_id == current_user.id)
    )
    await db.commit()

    return {"message": "Cart cleared successfully"}