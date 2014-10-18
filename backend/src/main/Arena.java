package main;

import java.util.ArrayList;
import java.util.Date;
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
	private List<Projectile> projectiles;
	
	private double width, height;
	
	public Arena() {
		players = new HashMap<WebSocket, Player>();
		arenaObjects = new ArrayList<>();
		projectiles = new ArrayList<>();
		
		width = DEFAULT_WIDTH;
		height = DEFAULT_HEIGHT;
		
		designArena();
		
		new Thread() {
			public void run() {
				handleProjectiles();
			}
		}.start();
	}
	
	private Message getArenaInitMessage() {
		JSONObject arenaSize = new JSONObject();
		arenaSize.put("w", width);
		arenaSize.put("h", height);
		return new Message("arenainit", -1, arenaSize);
	}
	
	private void designArena() {
		arenaObjects.clear();
		arenaObjects.add(new ArenaObject("Wall", 0, 0, 10, height));
		arenaObjects.add(new ArenaObject("Wall", 0, 0, width, 10));
		arenaObjects.add(new ArenaObject("Wall", width - 10, 0, 10, height));
		arenaObjects.add(new ArenaObject("Wall", 0, height - 10, width, 10));
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
	
	private void strikePlayer(Player striker, Player struck, boolean ranged) {
		// TODO: Damage/otherwise interact here! Then
		// send updates to all players.
	}
	
	private void handleProjectiles() {
		// TODO: Threadsafe?
		while (true) {
			try {
				Thread.sleep(20);
				for (int i = 0; i < projectiles.size(); i++) {
					Projectile proj = projectiles.get(i);
					proj.step(.02);
					boolean hitWall = false;
					for (ArenaObject ao : arenaObjects) {
						if (ao.getType().compareTo("Wall") == 0 &&
								ao.checkCollision(proj.getBoundingBox())) {
							JSONObject strikeObj = new JSONObject();
							strikeObj.put("x", proj.getX());
							strikeObj.put("y", proj.getY());
							strikeObj.put("projectileid", proj.getId());
							Message strikeMessage = new Message(
									"projhit", -1, strikeObj);
							for (Player player : players.values()) {
								player.sendMessage(strikeMessage);
							}
							projectiles.remove(i);
							i--;
							hitWall = true;
							break;
						}
					}
					if (hitWall) break;
					for (Player player : players.values()) {
						if (player.getId() != proj.getShooterId() &&
								player.getBoundingBox().intersect(proj.getBoundingBox())) {
							JSONObject strikeObj = new JSONObject();
							strikeObj.put("x", proj.getX());
							strikeObj.put("y", proj.getY());
							strikeObj.put("projectileid", proj.getId());
							Message strikeMessage = new Message(
									"projhit", player.getId(), strikeObj);
							Player striker = null;
							for (Player player2 : players.values()) {
								player2.sendMessage(strikeMessage);
								if (player2.getId() == proj.getShooterId())
									striker = player2;
							}
							strikePlayer(striker, player, true);
							projectiles.remove(i);
							i--;
							break;
						}
					}
				}
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}
	
	public void processPlayerMessage(WebSocket playerSocket, Message msg) {
		double x, y;
		JSONObject attack;
		
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
			p.sendMessage(RuleImport.ruleMapMessage());
			p.sendMessage(RuleImport.metaMapMessage());
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
		case "t":
			JSONObject tdata = new JSONObject();
			tdata.put("me", System.currentTimeMillis());
			tdata.put("you", ((JSONObject)msg.getData()).get("t"));
			p.sendMessage(new Message("sync", -1, tdata));
			break;
		case "p":
			/*
			 * Player position/data update. Notify all other players of the
			 * new information, and store on the server.
			 */
			JSONObject playerData = (JSONObject) msg.getData();
			// Extract player data.
			x = playerData.getDouble("x");
			y = playerData.getDouble("y");
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
		case "directional":
			// Directional attack from the player.
			attack = (JSONObject) msg.getData();
			x = attack.getDouble("x");
			y = attack.getDouble("y");
			String dir = attack.getString("dir"); // 'u','d','l', or 'r'
			System.out.println("Attack by " + p.getType());
			Map<String, String> metaMap = RuleImport.getMap(false).get(p.getType());
			String meleeType = metaMap.get("MeleeType");
			String projectileType = metaMap.get("ProjectileType");
			if (!meleeType.isEmpty()) { // Melee attack
				// TODO: Melee damage
				double attackX = x;
				double attackY = y;
				switch (dir.charAt(0)) {
				case 'u':
					attackY -= 48;
					break;
				case 'd':
					attackY += 48;
					break;
				case 'r':
					attackX += 48;
					break;
				case 'l':
					attackY -= 48;
					break;
				}
				BoundingBox attackBox = new BoundingBox(attackX, attackY, 48, 48);
				for (Player player : players.values()) {
					if (player != p && p.getBoundingBox().intersect(attackBox)) {
						JSONObject hitObj = new JSONObject();
						hitObj.put("x", x);
						hitObj.put("y", y);
						hitObj.put("type", meleeType);
						player.sendMessage(new Message("meleehit", p.getId(), hitObj));
						strikePlayer(p, player, false);
					}
				}
				JSONObject meleeObj = new JSONObject();
				meleeObj.put("type", meleeType);
				meleeObj.put("x", x);
				meleeObj.put("y", y);
				meleeObj.put("dir", dir);
				Message meleeMessage = new Message("melee", p.getId(), meleeObj);
				for (Player player : players.values()) {
					player.sendMessage(meleeMessage);
				}
				// TODO: Check collisions and do damage.
			} else { // Projectile attack
				Projectile proj = new Projectile(projectileType, x, y, dir.charAt(0), p.getId());
				projectiles.add(proj);
				Message projMessage = proj.getMessage();
				for (Player player : players.values()) {
					player.sendMessage(projMessage);
				}
			}
			break;
		case "special":
			// Special attack from the player.
			attack = (JSONObject) msg.getData();
			x = attack.getDouble("x");
			y = attack.getDouble("y");
			// TODO: Special behavior.
			break;
		default:
			System.err.println("Recieved unknown event type " + msg.getEventName());
		}
	}
}
