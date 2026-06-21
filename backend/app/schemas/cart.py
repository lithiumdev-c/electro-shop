from pydantic import BaseModel, Field 
from typing import Optional

class CartItemSchema(BaseModel):
    product_id: int = Field(..., description="Product id")
    quantity: int = Field(..., gt=0, description="Quantity (must be greater than 0)")

class CartItemCreate(CartItemSchema):
    pass

class CartItemUpdate(BaseModel):
    product_id: int = Field(..., description="Product id")
    quantity: int = Field(..., gt=0, description="Quantity (must be greater than 0)")

class CartItem(BaseModel):
    product_id: int
    name: str = Field(..., description="Product name")
    price: float = Field(..., description="Product price")
    quantity: int = Field(..., description="Quantity in cart")
    subtotal: float = Field(..., description="Total price for this item (price * quantity)")
    image_url: Optional[str] = Field(None, description="Product image URL")

class CartItemResponse(BaseModel):
    items: list[CartItem] = Field(..., description="List of the cart items")
    total: float = Field(..., description="Total cart price")
    items_count: int = Field(..., description="Total number of items in cart")