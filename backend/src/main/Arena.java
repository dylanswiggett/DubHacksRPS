package main;

import java.util.HashMap;
import java.util.Map;

import org.java_websocket.WebSocket;

public class Arena {
	private Map<WebSocket, Player> players;
	
	public Arena() {
		players = new HashMap<WebSocket, Player>();
	}
	
	public void addPlayer(Player p, WebSocket playerSocket) {
		players.put(playerSocket, p);
	}
	
	public void removePlayer(WebSocket playerSocket) {
		players.remove(playerSocket);
	}
	
	public void processPlayerMessage(WebSocket playerSocket, Message msg) {
		Player p = players.get(playerSocket);
	}
}
