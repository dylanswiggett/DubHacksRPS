package main;

import java.net.InetSocketAddress;
import java.net.UnknownHostException;
import java.util.Collections;

import org.java_websocket.WebSocket;
import org.java_websocket.drafts.Draft;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

public class RPSServer extends WebSocketServer {

	public RPSServer( int port , Draft d ) throws UnknownHostException {
		super( new InetSocketAddress( port ), Collections.singletonList( d ) );
	}

	@Override
	public void onClose(WebSocket arg0, int arg1, String arg2, boolean arg3) {
	}

	@Override
	public void onError(WebSocket arg0, Exception arg1) {
	}

	@Override
	public void onMessage(WebSocket arg0, String arg1) {
		System.out.println(arg1);
		arg0.send("HI, THIS IS WORLD.");
	}

	@Override
	public void onOpen(WebSocket arg0, ClientHandshake arg1) {
	}

}
