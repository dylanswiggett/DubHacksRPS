package main;

import org.java_websocket.WebSocket;

public class Player {
	private static int id_counter = 0;
	
	private WebSocket socket;
	private int id;
	private double health;
	private boolean alive;
	private String type;
	private double x, y;
	
	public Player(WebSocket socket) {
		this.socket = socket;
		this.id = id_counter++;
		x = y = 0;
	}
	
	public int getId() {
		return id;
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
	
	public void sendMessage(Message msg) {
		socket.send(msg.toString());
	}
}
