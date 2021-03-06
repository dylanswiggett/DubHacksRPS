package main;

import java.net.InetSocketAddress;
import java.net.UnknownHostException;
import java.util.Collections;

import org.java_websocket.WebSocket;
import org.java_websocket.drafts.Draft;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

public class RPSServer extends WebSocketServer {
	
	Arena arena;

	public RPSServer( int port , Draft d ) throws UnknownHostException {
		super( new InetSocketAddress( port ), Collections.singletonList( d ) );
		try {
			arena = new Arena();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Override
	public void onClose(WebSocket arg0, int arg1, String arg2, boolean arg3) {
		try {
			arena.removePlayer(arg0);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Override
	public void onError(WebSocket arg0, Exception arg1) {
		try {
			arg1.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Override
	public void onMessage(WebSocket arg0, String arg1) {
		try {
			arena.processPlayerMessage(arg0, Message.fromString(arg1));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Override
	public void onOpen(WebSocket arg0, ClientHandshake arg1) {
		try {
			Player newPlayer = new Player(arg0);
			arena.addPlayer(newPlayer, arg0);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
