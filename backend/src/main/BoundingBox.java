package main;

public class BoundingBox {

	double x, y, width, height;
	
	public BoundingBox(double x, double y, double width, double height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	
	public boolean intersect(BoundingBox other) {
		return (this.x < other.x + other.width)  &&
			   (this.x + this.width > other.x)   && 
			   (this.y < other.y + other.height) &&
			   (this.y + this.height > other.y);
	}
}
