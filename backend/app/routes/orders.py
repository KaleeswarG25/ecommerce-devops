from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import sqlalchemy as sa
from app.database import get_db
from app.models import Order, OrderItem, Product, User
from app.schemas import OrderCreate, OrderResponse, OrderUpdate
from app.auth.dependencies import get_current_user, get_current_admin_user
from decimal import Decimal

router = APIRouter()

@router.post("/", response_model=OrderResponse)
async def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Get cart items
    result = await db.execute(
        select(Order, Product)
        .join(Product, Order.product_id == Product.id)
        .where(Order.user_id == current_user.id, Product.is_active == True)
    )

    cart_items = []
    total_amount = Decimal('0.00')

    for cart_item, product in result:
        if product.stock_quantity < cart_item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for product {product.name}"
            )

        cart_items.append((cart_item, product))
        total_amount += Decimal(str(product.price)) * cart_item.quantity

    if not cart_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cart is empty"
        )

    # Create order
    order = Order(
        user_id=current_user.id,
        total_amount=float(total_amount),
        shipping_address=order_data.shipping_address
    )
    db.add(order)
    await db.commit()
    await db.refresh(order)

    # Create order items and update stock
    order_items = []
    for cart_item, product in cart_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=cart_item.quantity,
            price=float(product.price)
        )
        db.add(order_item)

        # Update stock
        product.stock_quantity -= cart_item.quantity

        order_items.append({
            "id": order_item.id,
            "product_id": product.id,
            "product_name": product.name,
            "quantity": cart_item.quantity,
            "price": Decimal(str(product.price))
        })

    # Clear cart
    await db.execute(sa.delete(Order).where(Order.user_id == current_user.id))

    await db.commit()

    return OrderResponse(
        id=order.id,
        user_id=order.user_id,
        total_amount=Decimal(str(order.total_amount)),
        status=order.status,
        shipping_address=order.shipping_address,
        items=order_items,
        created_at=order.created_at.isoformat()
    )

@router.get("/", response_model=List[OrderResponse])
async def get_user_orders(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Order).where(Order.user_id == current_user.id).order_by(Order.created_at.desc())
    )
    orders = result.scalars().all()

    order_responses = []
    for order in orders:
        # Get order items
        items_result = await db.execute(
            select(OrderItem, Product)
            .join(Product, OrderItem.product_id == Product.id)
            .where(OrderItem.order_id == order.id)
        )

        items = []
        for order_item, product in items_result:
            items.append({
                "id": order_item.id,
                "product_id": order_item.product_id,
                "product_name": product.name,
                "quantity": order_item.quantity,
                "price": Decimal(str(order_item.price))
            })

        order_responses.append(OrderResponse(
            id=order.id,
            user_id=order.user_id,
            total_amount=Decimal(str(order.total_amount)),
            status=order.status,
            shipping_address=order.shipping_address,
            items=items,
            created_at=order.created_at.isoformat()
        ))

    return order_responses

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order_by_id(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()

    if not order or order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    # Get order items
    items_result = await db.execute(
        select(OrderItem, Product)
        .join(Product, OrderItem.product_id == Product.id)
        .where(OrderItem.order_id == order.id)
    )

    items = []
    for order_item, product in items_result:
        items.append({
            "id": order_item.id,
            "product_id": order_item.product_id,
            "product_name": product.name,
            "quantity": order_item.quantity,
            "price": Decimal(str(order_item.price))
        })

    return OrderResponse(
        id=order.id,
        user_id=order.user_id,
        total_amount=Decimal(str(order.total_amount)),
        status=order.status,
        shipping_address=order.shipping_address,
        items=items,
        created_at=order.created_at.isoformat()
    )

@router.put("/{order_id}")
async def update_order_status(
    order_id: int,
    order_data: OrderUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    if order_data.status:
        order.status = order_data.status

    await db.commit()

    return {"message": "Order updated successfully"}

@router.get("/admin/all", response_model=List[OrderResponse])
async def get_all_orders(
    current_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Order).order_by(Order.created_at.desc()))
    orders = result.scalars().all()

    order_responses = []
    for order in orders:
        # Get order items
        items_result = await db.execute(
            select(OrderItem, Product)
            .join(Product, OrderItem.product_id == Product.id)
            .where(OrderItem.order_id == order.id)
        )

        items = []
        for order_item, product in items_result:
            items.append({
                "id": order_item.id,
                "product_id": order_item.product_id,
                "product_name": product.name,
                "quantity": order_item.quantity,
                "price": Decimal(str(order_item.price))
            })

        order_responses.append(OrderResponse(
            id=order.id,
            user_id=order.user_id,
            total_amount=Decimal(str(order.total_amount)),
            status=order.status,
            shipping_address=order.shipping_address,
            items=items,
            created_at=order.created_at.isoformat()
        ))

    return order_responses