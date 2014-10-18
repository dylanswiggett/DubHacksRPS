package main;

import org.json.JSONObject;

public class Message {
	private String evt;
	private int id;
	private Object data;
	
	public Message(String evt, int id, Object data) {
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
	
	public Object getData() {
		return data;
	}
	
	public JSONObject toJSON() {
		JSONObject obj = new JSONObject();
		obj.put("evt", evt);
		obj.put("id", id);
		obj.put("d", data);
		return obj;
	}
	
	public String toString() {
		return toJSON().toString();
	}
	
	public static Message fromString(String s) {
		JSONObject jsonMessage = new JSONObject(s);
		Object data = null;
		if (jsonMessage.has("d") && !jsonMessage.isNull("d"))
			data = jsonMessage.get("d");
		return new Message(jsonMessage.getString("evt"),
							jsonMessage.getInt("id"),
							data);
	}
}
