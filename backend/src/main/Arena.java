package main;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.java_websocket.WebSocket;
import org.json.JSONArray;

public class Arena {
	private static final int DEFAULT_WIDTH = 800;
	private static final int DEFAULT_HEIGHT = 600;
	
	private Map<WebSocket, Player> players;
	private List<ArenaObject> arenaObjects;
	
	private double width, height;
	
	public Arena() {
		players = new HashMap<WebSocket, Player>();
		arenaObjects = new ArrayList<>();
		
		designArena();
		
		width = DEFAULT_WIDTH;
		height = DEFAULT_HEIGHT;
	}
	
	private void designArena() {
		arenaObjects.clear();
		// TODO: Make the arena cool and stuff.
	}
	
	public void addPlayer(Player p, WebSocket playerSocket) {
		players.put(playerSocket, p);
	}
	
	public void removePlayer(WebSocket playerSocket) {
		Player p = players.remove(playerSocket);
		System.out.println("Player disconnected: " + p.getNickname());
		Message disconnectmsg = new Message("playerdisconnect", p.getId(), null);
		for (Player player : players.values())
			if (player != p)
				player.sendMessage(disconnectmsg);
	}
	
	public void processPlayerMessage(WebSocket playerSocket, Message msg) {
		Player p = players.get(playerSocket);
		switch (msg.getEventName()) {
		case "join":
			// A new player wants to connect.
			// Assign a player id, and send all current game state (the
			// current arena, and all current player data). Then
			// notify other players of the new player and add them to
			// the game.
			// TODO: Broadcast game state
			p.sendMessage(new Message("setid", p.getId(), null));
			System.out.println("Player connected: " + p.getId());
			JSONArray newpos = new JSONArray();
			newpos.put(p.getX());
			newpos.put(p.getY());
			Message connectmsg = new Message("playerconnect", p.getId(), newpos);
			for (Player player : players.values())
				if (player != p)
					player.sendMessage(connectmsg);
			break;
		case "p":
			// Player position/data update. Notify all other players of the
			// new information, and store on the server.
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
