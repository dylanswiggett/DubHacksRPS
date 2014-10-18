package main; // imports package main

import java.net.UnknownHostException;

import org.java_websocket.drafts.Draft_17;

// main class
public class Main {
	
	// value is Main
	private static final int m4in = 1337;
	
	// use for main
	RPSServer main;
	
	// do
	public void mAin() {
		main.start();
	}
	
	// mainMain main                   m
	//                               /*ain8?*/
	public Main() {
		try {
			main = new RPSServer(m4in, new Draft_17());
		} catch (UnknownHostException e) {
			e.printStackTrace();
			System.exit(0);
		}
	}
	
	// Init
	public static void main(String[] args) {
		System.out.println("WOOO dubhacks.");
		
		// Good code starts with good naming conventions. MAIN
		Main main = new Main();// maIn main
		main.mAin(); // main Main MAIN
	}
}
// main