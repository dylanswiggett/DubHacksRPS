package main;

import org.json.JSONObject;

public class Projectile {
	private static int idCount = 0;
	
	private static final int DIMENSION = 15;
	
	private String type;
	private double x, y, vx, vy;
	private char dir;
	private int sourceId;
	private int projectileId;
	private double chargeTime;
	
	public Projectile(String type, double x, double y, char dir, int sourceId) {
		this.type = type;
		this.x = x;
		this.y = y;
		this.dir = dir;
		this.sourceId = sourceId;
		projectileId = idCount++;
		chargeTime = .25;
		double v = 200 + Double.parseDouble(
				RuleImport.getMap(false).get(type).get("Velocity")); // TODO: Get this from type
		switch (this.dir) {
		case 'u':
			vx = 0;
			vy = -v;
			break;
		case 'd':
			vx = 0;
			vy = v;
			break;
		case 'r':
			vx = v;
			vy = 0;
			break;
		case 'l':
			vx = -v;
			vy = 0;
			break;
		default:
			System.err.println("Unrecognized direction: " + this.dir);
		}
	}
	
	public void step(double time) {	// Time in seconds
		if (chargeTime > 0)
			chargeTime -= time;
		else {
			x += vx * time;
			y += vy * time;
		}
	}
	
	public boolean hitsPlayer(Player p) {
		return false;
	}
	
	public Message getMessage() {
		JSONObject obj = new JSONObject();
		obj.put("type", type);
		obj.put("x", x);
		obj.put("y", y);
		obj.put("vx", vx);
		obj.put("vy", vy);
		obj.put("projectileid", projectileId);
		obj.put("starttime", System.currentTimeMillis());
		return new Message("projectile", sourceId, obj);
	}
	
	public int getShooterId() {
		return sourceId;
	}
	
	public int getId() {
		return projectileId;
	}
	
	public double getX() {
		return x;
	}
	
	public double getY() {
		return y;
	}
	
	public BoundingBox getBoundingBox() {
		return new BoundingBox(x - DIMENSION, y - DIMENSION,
				DIMENSION * 2, DIMENSION * 2);
	}
}
