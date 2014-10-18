package main;

import org.java_websocket.WebSocket;

public class Player {
	private WebSocket socket;
	
	public Player(WebSocket socket) {
		this.socket = socket;
	}
}
