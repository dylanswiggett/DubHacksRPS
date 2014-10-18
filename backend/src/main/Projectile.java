package main;

import org.json.JSONObject;

public class Projectile {
	private static int idCount = 0;
	
	private String type;
	private double x, y, vx, vy;
	private char dir;
	private int sourceId;
	private int projectileId;
	
	public Projectile(String type, double x, double y, char dir, int sourceId) {
		this.type = type;
		this.x = x;
		this.y = y;
		this.dir = dir;
		this.sourceId = sourceId;
		projectileId = idCount++;
		double v = 100; // TODO: Get this from type
		switch (this.dir) {
		case 'u':
			vx = 0;
			vy = -v;
			break;
		case 'd':
			vx = 0;
			vy = v;
		case 'r':
			vx = v;
			vy = 0;
		case 'l':
			vx = -v;
			vy = 0;
		}
	}
	
	public void step(double time) {	// Time in seconds
		x += vx * time;
		y += vy * time;
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
		return new Message("projectile", sourceId, obj);
	}
}