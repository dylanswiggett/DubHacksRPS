package main;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.json.JSONObject;

public class RuleImport {

	private static Map<String, Map<String, String>> ruleMap = null;
	private static Map<String, Map<String, String>> metaMap = null;
	private static final String ruleFilePath = "../RPS.csv";
	private static final String metaFilePath = "../RPSMeta.csv";
	
	private static Map<String, Map<String, String>> importMap(boolean basic) {
		Path file;
		if (basic) {
			file = Paths.get(ruleFilePath);
			return importRuleMap(file);
		} else {
			file = Paths.get(metaFilePath);
			return importMetaMap(file);
		}
		
	}
	
	private static Map<String, Map<String, String>> importRuleMap(Path file) {
		
		Charset charset = Charset.forName("US-ASCII");
		try (BufferedReader reader = Files.newBufferedReader(file, charset)) {
			String line = null;
			List<String> paramList = null;
			int numParams = 0;
			line = reader.readLine();
			if (line != null) {
				paramList = Arrays.asList(line.split(","));
				numParams = paramList.size();
			}
			while ((line = reader.readLine()) != null) {
				List<String> row = Arrays.asList(line.split(",", numParams));
				String key = null;
				for (int i = 0; i < row.size(); i++) {
					if (i == 0) {
						key = row.get(i);
						ruleMap.put(key, new HashMap<String, String>());
					} else {
						Map<String, String> rowRuleMap = ruleMap.get(key);
						rowRuleMap.put(paramList.get(i), row.get(i));
						ruleMap.put(key, rowRuleMap);
					}
				}
			}
		} catch (IOException x) {
			System.err.format("IOException: %s%n", x);
		}
		
		Set<String> keys = ruleMap.keySet();
		for (String key : keys) {
			Map<String, String> rowRuleMap = ruleMap.get(key);
			Set<String> rowKeys = rowRuleMap.keySet();
			for (String rowKey : rowKeys) {
				String ruleValue = rowRuleMap.get(rowKey);
				if (ruleValue.equals("")) {
					Map<String, String> otherRowRuleMap = ruleMap.get(rowKey);
					String otherRowRuleValue = otherRowRuleMap.get(key);
					int otherRowRuleNum = Integer.parseInt(otherRowRuleValue);
					otherRowRuleNum *= -1;
					String newRuleValue = String.valueOf(otherRowRuleNum);
					rowRuleMap.put(rowKey, newRuleValue);
				}
			}
			ruleMap.put(key, rowRuleMap);
		}
		
		return ruleMap;
	}
	
	private static Map<String, Map<String, String>> importMetaMap(Path file) {
		Charset charset = Charset.forName("US-ASCII");
		try (BufferedReader reader = Files.newBufferedReader(file, charset)) {
			String line = null;
			List<String> paramList = null;
			int numParams = 0;
			line = reader.readLine();
			if (line != null) {
				paramList = Arrays.asList(line.split(","));
				numParams = paramList.size();
			}
			while ((line = reader.readLine()) != null) {
				List<String> row = Arrays.asList(line.split(",", numParams));
				String key = null;
				for (int i = 0; i < row.size(); i++) {
					if (i == 0) {
						key = row.get(i);
						metaMap.put(key, new HashMap<String, String>());
					} else {
						Map<String, String> rowRuleMap = metaMap.get(key);
						rowRuleMap.put(paramList.get(i), row.get(i));
						metaMap.put(key, rowRuleMap);
					}
				}
			}
		} catch (IOException x) {
			System.err.format("IOException: %s%n", x);
		}
		

		return metaMap;
	}
	
	/**
	 * Gives a map based on a CSV, boolean determines which CSV to use
	 * 
	 * @param basic True gives ruleMap, False gives metaMap
	 * @return
	 */
	public static Map<String, Map<String, String>> getMap(boolean basic) {
		if (basic && ruleMap == null) {
			ruleMap = new HashMap<String, Map<String, String>>();
			ruleMap = importMap(true);
			return Collections.unmodifiableMap(ruleMap);
		} else if (basic && ruleMap != null) {
			return Collections.unmodifiableMap(ruleMap);
		} else if (basic && metaMap == null) {
			System.out.println("here");
			metaMap = new HashMap<String, Map<String, String>>();
			metaMap = importMap(false);
			return Collections.unmodifiableMap(metaMap);
		} else {
			return Collections.unmodifiableMap(metaMap);
		}
		
		
	}
	
	public static Message ruleMapMessage() {		
		JSONObject data = new JSONObject();
		getMap(true);
		Set<String> types = ruleMap.keySet();
		for (String type : types) {
			JSONObject rules = new JSONObject();
			Map<String, String> rowRuleMap = ruleMap.get(type);
			Set<String> rowKeys = rowRuleMap.keySet();
			for (String rowKey : rowKeys) {
				String ruleValue = rowRuleMap.get(rowKey);
				rules.put(rowKey, ruleValue);
			}
			data.put(type, rules);
		}
		return new Message("playertypes", -1, data);
	}
	
	public static Message metaMapMessage() {
		JSONObject data = new JSONObject();
		getMap(false);
		Set<String> types = metaMap.keySet();
		for (String type : types) {
			JSONObject info = new JSONObject();
			Map<String, String> rowInfoMap = metaMap.get(type);
			Set<String> rowKeys = rowInfoMap.keySet();
			for (String rowKey : rowKeys) {
				String infoValue = rowInfoMap.get(rowKey);
				info.put(rowKey, infoValue);
			}
			data.put(type, info);
		}
		return new Message("playermetainfo", -1, data);
	}
}