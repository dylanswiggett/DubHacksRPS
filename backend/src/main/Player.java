package main;

import org.java_websocket.WebSocket;

public class Player {
	private WebSocket socket;
	private int id;
	
	public Player(WebSocket socket) {
		this.socket = socket;
		this.id = -1;
	}
	
	public int getId() {
		return id;
	}
	
	public void sendMessage(Message msg) {
		socket.send(msg.toString());
	}
}
