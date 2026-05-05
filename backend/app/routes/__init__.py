from .auth import router as auth_router
from .products import router as products_router
from .cart import router as cart_router
from .orders import router as orders_router
from .health import router as health_router
from .admin import router as admin_router
from .metrics import router as metrics_router

__all__ = [
    "auth_router",
    "products_router",
    "cart_router",
    "orders_router",
    "health_router",
    "admin_router",
    "metrics_router"
]