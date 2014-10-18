package main;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class RuleImport {

	private Map<String, Map<String, String>> ruleMap = new HashMap<String, Map<String, String>>();
	
	public Map<String, Map<String, String>> main(String filePath) {
		Path file = Paths.get(filePath);
		
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
	
	public Map<String, Map<String, String>> getMap() {
		return ruleMap;
	}
}