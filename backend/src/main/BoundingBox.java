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
		return (other.x > this.x && other.x < this.x + this.width) && (other.y > this.y && other.y < this.y + this.height);
	}
}
