package main;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.java_websocket.WebSocket;
import org.json.JSONArray;
import org.json.JSONObject;

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
	
	private Message getArenaInitMessage() {
		JSONObject arenaSize = new JSONObject();
		arenaSize.put("w", width);
		arenaSize.put("h", height);
		return new Message("arenainit", -1, arenaSize);
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
			/*
			 * A new player wants to connect.
			 * Assign a player id, and send all current game state (the
			 * current arena, and all current player data). Then
			 * notify other players of the new player and add them to
			 * the game.
			 */
			// Send current arena state
			p.sendMessage(getArenaInitMessage());
			for (ArenaObject obj : arenaObjects)
				p.sendMessage(obj.getInitMessage());
			// Send current player states
			for (Player player : players.values()) {
				if (player != p)
					p.sendMessage(
							new Message("p", player.getId(), player.getStatusData()));
			}
			// Add new player to game!
			p.sendMessage(new Message("setid", p.getId(), p.getStatusData()));
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
			/*
			 * Player position/data update. Notify all other players of the
			 * new information, and store on the server.
			 */
			JSONObject playerData = (JSONObject) msg.getData();
			// Extract player data.
			Double x = playerData.getDouble("x");
			Double y = playerData.getDouble("y");
			Double vx = playerData.getDouble("vx");
			Double vy = playerData.getDouble("vy");
			
			// Process player data
			p.setPosition(x, y);
			p.setVelocity(vx, vy);
			String type = null;
			if (playerData.has("type")) {
				type = playerData.getString("type");
				p.setType(type);
			}
			
			// Update all players 
			if (playerData.has("h"))
				playerData.remove("h");
			playerData.put("h", p.getHealth());
			for (Player player : players.values())
					player.sendMessage(msg);
			break;
		default:
			System.err.println("Recieved unknown event type " + msg.getEventName());
		}
	}
}
