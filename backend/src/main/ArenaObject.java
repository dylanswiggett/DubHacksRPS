package main;

import org.json.JSONObject;

// Stuff lying around the arena, e.g. walls, groundwater.
public class ArenaObject {
	private String type;
	private double x, y, width, height;
	
	public ArenaObject(String type, double x, double y, double width, double height) {
		this.type = type;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	
	public boolean checkPlayerCollision(Player p) {
		System.out.println("checkPlayerCollision not implemented.");
		return false;
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
