package main;

import org.json.JSONObject;

// Stuff lying around the arena, e.g. walls, groundwater.
public class ArenaObject {
	private String type;
	private double x, y, width, height;
	private BoundingBox box;
	
	public ArenaObject(String type, double x, double y, double width, double height) {
		this.type = type;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.box = new BoundingBox(x, y, width, height);
	}
	
	public boolean checkPlayerCollision(Player p) {
		BoundingBox playerBox = p.getBoundingBox();
		return box.intersect(playerBox);
	}
	
	public Message getInitMessage() {
		JSONObject messageData = new JSONObject();
		messageData.put("type", type);
		messageData.put("x", x);
		messageData.put("y", y);
		messageData.put("w", width);
		messageData.put("h", height);
		
		return new Message("arenaobject", -1, messageData);
	}
}
