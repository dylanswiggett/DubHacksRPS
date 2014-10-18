package main;

import java.net.UnknownHostException;

import org.java_websocket.drafts.Draft_17;

public class Main {
	
	private static final int PORT = 1337;
	
	RPSServer server;
	
	public void mAin() {
		server.start();
	}
	
	public Main() {
		try {
			server = new RPSServer(PORT, new Draft_17());
		} catch (UnknownHostException e) {
			e.printStackTrace();
			System.exit(0);
		}
	}
	
	public static void main(String[] args) {
		System.out.println("WOOO dubhacks.");
		
		// Good code starts with good naming conventions.
		Main main = new Main();
		main.mAin();
	}
}
