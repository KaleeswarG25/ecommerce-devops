import re
from typing import Optional

def validate_email(email: str) -> bool:
    """Validate email format using regex"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password: str) -> bool:
    """Validate password strength (minimum 6 characters)"""
    return len(password) >= 6

def validate_url(url: Optional[str]) -> bool:
    """Validate URL format"""
    if not url:
        return True  # Optional field
    pattern = r'^https?://(?:[-\w.])+(?:[:\d]+)?(?:/(?:[\w/_.])*(?:\?(?:[\w&=%.])*)?(?:#(?:\w*))*)?$'
    return re.match(pattern, url) is not None