package main;

import org.json.JSONObject;

public class Message {
	private String evt;
	private int id;
	private JSONObject data;
	
	public Message(String evt, int id, JSONObject data) {
		this.evt = evt;
		this.id = id;
		this.data = data;
	}
	
	public String getEventName() {
		return evt;
	}
	
	public int getID() {
		return id;
	}
	
	public JSONObject getData() {
		return data;
	}
	
	public JSONObject toJSON() {
		return new JSONObject(toString());
	}
	
	public String toString() {
		return "{ \"evt\":  \"" + evt             + "\"" +
				"  \"id\":   \"" + id              + "\"" +
				"  \"data\": \"" + data.toString() + "\"" +
				"}";
	}
	
	public static Message fromString(String s) {
		JSONObject jsonMessage = new JSONObject(s);
		return new Message(jsonMessage.getString("evt"),
							jsonMessage.getInt("id"),
							jsonMessage.getJSONObject("data"));
	}
}
