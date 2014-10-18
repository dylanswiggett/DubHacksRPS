package main;

import java.util.HashMap;
import java.util.Map;

import org.java_websocket.WebSocket;
import org.json.JSONArray;

public class Arena {
	private Map<WebSocket, Player> players;
	
	public Arena() {
		players = new HashMap<WebSocket, Player>();
	}
	
	public void addPlayer(Player p, WebSocket playerSocket) {
		players.put(playerSocket, p);
	}
	
	public void removePlayer(WebSocket playerSocket) {
		System.out.println("Player disconnected.");
		players.remove(playerSocket);
	}
	
	public void processPlayerMessage(WebSocket playerSocket, Message msg) {
		Player p = players.get(playerSocket);
		switch (msg.getEventName()) {
		case "join":
			p.sendMessage(new Message("setid", p.getId(), null));
			System.out.println("Player connected: " + p.getId());
			break;
		case "p":
			JSONArray pos = (JSONArray) msg.getData();
			Number x = (Number) pos.get(0);
			Number y = (Number) pos.get(1);
			p.setPosition(x.doubleValue(), y.doubleValue());
			System.out.println("Player " + p.getId() + " to " + x + ", " + y);
			for (Player player : players.values())
				if (player != p)
					player.sendMessage(msg);
			break;
		default:
			System.err.println("Recieved unknown event type " + msg.getEventName());
		}
	}
}
