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
	private double x, y, vx, vy;
	boolean ready;
	
	public Player(WebSocket socket) {
		this.socket = socket;
		this.id = id_counter++;
		nickname = Integer.toString(id);
		x = y = 100;
		type = "dead";
		ready = false;
	}
	
	public int getId() {
		return id;
	}
	
	public String getNickname() {
		return nickname;
	}
	
	public void isReady() {
		ready = true;
	}
	
	public void setNickname(String nick) {
		this.nickname = nick;
	}
	
	public double getHealth() {
		return health;
	}
	
	public void removeHealth(double amt) {
		health -= amt;
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
		if (type.compareTo(this.type) != 0) {
			System.out.println("Type was " + type);
			this.type = type;
			if (RuleImport.getMap(false).containsKey(type)) {
				this.health =
						Double.parseDouble(RuleImport.getMap(false).get(type).get("Health"));
				System.out.println("Type set to " + type + ", with " + this.health + " health.");
			} else {
				System.err.println("Type set to " + type);
			}
		}
	}
	
	public void setPosition(double x, double y) {
		this.x = x;
		this.y = y;
	}
	
	public void setVelocity(double vx, double vy) {
		this.vx = vx;
		this.vy = vy;
	}
	
	public double getX() {
		return x;
	}
	
	public double getY() {
		return y;
	}
	
	public double getVX() {
		return vx;
	}
	
	public double getVY() {
		return vy;
	}
	
	public JSONObject getStatusData() {
		JSONObject data = new JSONObject();
		data.put("x", x);
		data.put("y", y);
		data.put("vx", vx);
		data.put("vy", vy);
		data.put("type", type);
		data.put("h", health);
		return data;
	}
	
	public BoundingBox getBoundingBox() {
		return new BoundingBox(x + 4, y + 4, 40, 40);
	}
	
	public void sendMessage(Message msg) {
		if (ready)
			socket.send(msg.toString());
	}
}
