package main;

import org.java_websocket.WebSocket;
import org.json.JSONObject;

public class Player {
	private static int id_counter = 0;
	
	private WebSocket socket;
	private String nickname;
	private int id;
	private double health;
	private boolean alive;
	private String type;
	private double x, y;
	
	public Player(WebSocket socket) {
		this.socket = socket;
		this.id = id_counter++;
		nickname = Integer.toString(id);
		x = y = 0;
	}
	
	public int getId() {
		return id;
	}
	
	public String getNickname() {
		return nickname;
	}
	
	public void setNickname(String nick) {
		this.nickname = nick;
	}
	
	public double getHealth() {
		return health;
	}
	
	public boolean isAlive() {
		return alive;
	}
	
	public void kill() {
		alive = false;
		sendMessage(new Message("dead", getId(), null));
	}
	
	public String getType() {
		return type;
	}
	
	public void setType(String type) {
		this.type = type;
	}
	
	public void setPosition(double x, double y) {
		this.x = x;
		this.y = y;
	}
	
	public double getX() {
		return x;
	}
	
	public double getY() {
		return y;
	}
	
	public JSONObject getStatusData() {
		JSONObject data = new JSONObject();
		data.put("x", x);
		data.put("y", y);
		data.put("type", "dead");
		data.put("h", 0);
		return data;
	}
	
	public BoundingBox getBoundingBox() {
		return new BoundingBox(x, y, 1, 1);
	}
	
	public void sendMessage(Message msg) {
		socket.send(msg.toString());
	}
}
