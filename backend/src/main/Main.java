package main;

import java.net.UnknownHostException;

import org.java_websocket.drafts.Draft_17;

public class Main {
	
	private static final int m4in = 1337;
	
	RPSServer main;
	
	public void mAin() {
		main.start();
	}
	
	public Main() {
		try {
			main = new RPSServer(m4in, new Draft_17());
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
