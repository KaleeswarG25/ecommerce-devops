#!/usr/bin/env python3
"""
Test script for FastAPI E-Commerce Backend
"""
import sys
import os

def test_imports():
    """Test that all modules can be imported"""
    try:
        # Test main app import
        from main import app
        print("✓ Main app imported successfully")

        # Test database import
        from app.database import init_db, get_db
        print("✓ Database module imported successfully")

        # Test models import
        from app.models import User, Product, Cart, Order
        print("✓ Models imported successfully")

        # Test schemas import
        from app.schemas import UserCreate, ProductCreate, OrderCreate
        print("✓ Schemas imported successfully")

        # Test auth imports
        from app.auth.jwt import create_access_token, verify_password
        from app.auth.dependencies import get_current_user
        print("✓ Auth modules imported successfully")

        # Test routes import
        from app.routes import auth_router, products_router, cart_router
        print("✓ Routes imported successfully")

        # Test utils import
        from app.utils.validation import validate_email, validate_password
        print("✓ Utils imported successfully")

        return True

    except ImportError as e:
        print(f"✗ Import error: {e}")
        return False
    except Exception as e:
        print(f"✗ Unexpected error: {e}")
        return False

def test_validations():
    """Test validation functions"""
    from app.utils.validation import validate_email, validate_password

    # Test email validation
    assert validate_email("test@example.com") == True
    assert validate_email("invalid-email") == False
    print("✓ Email validation working")

    # Test password validation
    assert validate_password("123456") == True
    assert validate_password("123") == False
    print("✓ Password validation working")

def main():
    print("Testing FastAPI E-Commerce Backend...")
    print("=" * 50)

    # Test imports
    if not test_imports():
        print("✗ Import tests failed")
        sys.exit(1)

    # Test validations
    try:
        test_validations()
    except Exception as e:
        print(f"✗ Validation tests failed: {e}")
        sys.exit(1)

    print("=" * 50)
    print("✓ All tests passed! FastAPI backend is ready.")

if __name__ == "__main__":
    main()