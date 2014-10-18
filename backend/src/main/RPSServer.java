package main;

import java.net.UnknownHostException;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

public class RPSServer extends WebSocketServer {

	public RPSServer() throws UnknownHostException {
		super();
	}

	@Override
	public void onClose(WebSocket arg0, int arg1, String arg2, boolean arg3) {
	}

	@Override
	public void onError(WebSocket arg0, Exception arg1) {
	}

	@Override
	public void onMessage(WebSocket arg0, String arg1) {
	}

	@Override
	public void onOpen(WebSocket arg0, ClientHandshake arg1) {
	}

}
