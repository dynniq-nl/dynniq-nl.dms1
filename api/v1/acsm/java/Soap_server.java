package soap.server;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.io.StringReader;
import java.io.Writer;
import java.net.ServerSocket;
import java.net.Socket;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import logging.Logger;
import oracle.Oracle;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import rtap.Rtap;
import value.AssetConfiguration;
import value.AssetVal;
import value.ConstVal;
import value.DynAlgVal;

public class Soap_server implements Runnable{
	private Socket connection;	
	private ServerSocket providerSocket;
	private boolean runner;
	private int portNumber;
	private int logLevel;
	private int debugLevel;
	private long lastUpdate = 0;
	private StringBuffer answerString;
	HashMap<String, AssetConfiguration> totalConfig;

	public void addScantableItems(HashMap<String, AssetConfiguration> totalConfig){
		this.totalConfig = totalConfig;
	}
	public HashMap<String, AssetConfiguration> getScantableItems(){
		return new HashMap<String, AssetConfiguration>(this.totalConfig);
	}
	
	public Soap_server(int portNumber){
		this.portNumber = portNumber;
		this.runner = true;
		
		answerString = new StringBuffer();
        answerString.append("<?xml version='1.0' encoding='utf-8'?>\r\n");          
        answerString.append("<soap12:Envelope ");          
        answerString.append("xmlns:soap12=");          
        answerString.append(                  "'http://www.w3.org/2003/05/soap-envelope' ");          
        answerString.append("xmlns:xsi=");          
        answerString.append(                  "'http://www.w3.org/2001/XMLSchema-instance' ");
        answerString.append("xmlns:xsd=");          
        answerString.append(                  "'http://www.w3.org/2001/XMLSchema'>\r\n");                   
        answerString.append("<soap12:Body>\r\n");          
        answerString.append("<ReportChangesResponse xmlns='http://www.imtech.eu/' />\r\n");                   
        answerString.append("</soap12:Body>\r\n");          
        answerString.append("</soap12:Envelope>\r\n"); 
	}
	
	public void startServer() {		
		while(runner){
			try{
				// Opstarten van de server socket
				if(providerSocket == null){
					providerSocket = new ServerSocket(portNumber);
				}
				print("Server is waiting for answer on poort: " + portNumber, "", 2);
				connection = providerSocket.accept();
				
				SingleServerThread server = new SingleServerThread(connection);
				server.setName("SOAP_SINGLE_SERVER");
				server.start();		
			} catch(IOException ioException){
				ioException.printStackTrace();
				runner = false;
			}
		}
		
		print("Server is stoped.", "", 1);
	}
	
	class SingleServerThread extends Thread{
		Socket mySocket;
		Writer out = null;
		
		SingleServerThread(Socket s){
			mySocket = s;
		}
		
		public void run(){
			String serverId = mySocket.getInetAddress().toString();
			AssetConfiguration conf = totalConfig.get(serverId);
			print("Connection received from " + serverId, conf.getName(), 1);

			try {
				out = new OutputStreamWriter(mySocket.getOutputStream());
				
				Document doc = translateInputStreamToDomModel(mySocket.getInputStream());
				sendAcknowledge(out, conf.getName());
				closeConnection(conf.getName());
				
				handleValueContent(doc, conf);
			} catch (IOException e) {
				e.printStackTrace();
			} catch (SAXException e) {
				e.printStackTrace();
			} catch (ParserConfigurationException e) {
				e.printStackTrace();
			} finally{
				closeConnection(conf.getName());
			}
		}
		
		private void closeConnection(String serverId){
			try {
				if(out != null){
					out.close();
					out = null;
				}
				if(mySocket != null){
					mySocket.close();
					mySocket = null;
					print("Closed communication.", serverId, 2);
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	
	private void sendAcknowledge(Writer out, String serverId) throws IOException{                  
		out.write("HTTP/1.1 200 OK\r\n");
		out.write("Content-Type: application/soap+xml; charset=utf-8\r\n");
		out.write("Content-Length:" + answerString.toString().toCharArray().length + "\r\n\r\n");
		out.write(answerString.toString());
		out.flush();     
		
		print("Send Acknowledge to station.", serverId, 2);
	}
	
	private void handleValueContent(Document doc, AssetConfiguration conf){
		doc.getDocumentElement().normalize();
		
		print("Root element :" + doc.getDocumentElement().getNodeName(), conf.getName(), 3);
		NodeList nList = doc.getElementsByTagName("WebLogItem");

		for (int temp = 0; temp < nList.getLength(); temp++) {
			Node nNode = nList.item(temp);
			if (nNode.getNodeType() == Node.ELEMENT_NODE) {
	 
				Element eElement = (Element) nNode;
				
				String timeStamp 		= getTagValue("TimeStamp", eElement);
				String value 			= getTagValue("TextualValue", eElement);
				String sysId 			= getTagValue("SystemInstanceID", eElement);
				String standardOutput 	= getTagValue("StandardOutput", eElement);
				
				if(logLevel >= 3){
					print("LogID : " + getTagValue("LogID", eElement), conf.getName(), 3);
					print("SystemInstanceID : " + sysId, conf.getName(), 3);
					print("GroupID : " + getTagValue("GroupID", eElement), conf.getName(), 3);
				    print("LocationID : " + getTagValue("LocationID", eElement), conf.getName(), 3);
					print("TagID : " + getTagValue("TagID", eElement), conf.getName(), 3);
					print("LogType : " + getTagValue("LogType", eElement), conf.getName(), 3);
					print("TextualValue : " + value, conf.getName(), 3);
				    print("TimeStamp : " + timeStamp, conf.getName(), 3);
					print("Quality : " + getTagValue("Quality", eElement), conf.getName(), 3);
					print("StandardOutput : " + standardOutput, conf.getName(), 3);
				}
				
				String key = sysId + "_" + standardOutput;
				AssetVal asVal = conf.getRtapScanTableConfiguration().get(key);

				print("Imtech Key: " + key, conf.getName(), 1);

				long fieldTime = parseTimeToLong(timeStamp);
				long serverTime = System.currentTimeMillis();
				updateHeartBeat(conf.getName(), serverTime, conf.getName());
				conf.setLastUpdte(serverTime);
				
				if(null != asVal){
					if(value != null){
						value = value.replaceAll(" ", "");
					}
					
					if(value != null && timeStamp != null){
						if(isInteger(value)){
							handleValue(asVal, value, fieldTime, conf.getName());
							print("Write alias: " + asVal.getAlias() + " val: " + value + " time: " + timeStamp, conf.getName(), 1);
						} else{
							if(value.indexOf(",") != -1 || value.indexOf(".") != -1){
								value = value.replaceAll(",", ".");
								handleValue(asVal, value, fieldTime, conf.getName());
								print("Write alias: " + asVal.getAlias() + " val: " + value + " time: " + timeStamp, conf.getName(), 1);
							} else{
								print("ERROR: received value was not integer: " + value + " from alias: " + asVal.getAlias(), conf.getName(), 0);
							}
						}
					} else{
						print("ERROR: Value or timestamp was 0", conf.getName(), 0);
					}
				} else{
					if(getTagValue("SystemInstanceID", eElement).equals("344") && getTagValue("StandardOutput", eElement).equals("Measurement_3")){
						print("Received a heartbeat.", conf.getName(), 1);
						
					} else{
						print("WARNING: No RtapAtrr found; Sys.ID: " + getTagValue("SystemInstanceID", eElement) + " and StandardOutput: " + getTagValue("StandardOutput", eElement), conf.getName(), 0);
					}
				}
			}
		}
	}
	
	private void handleValue(AssetVal asVal, String value, long time, String serverId){
		if((value.endsWith("%") || value.endsWith("C")) && value.length() > 2){
			value = value.substring(0, value.length()-2);
		}
		writeRtapVal(asVal.getAlias(), value, time, serverId);
		writeOracleVal(asVal, value, time, serverId);
	}
	
	private void updateHeartBeat(String asset, long time, String serverId){
		if(DynAlgVal.rtap == null){
			DynAlgVal.rtap = new Rtap(DynAlgVal.isVerbose());
		}
		
		if(time > lastUpdate){
			if(DynAlgVal.rtap != null){
				if(!DynAlgVal.rtap.writeRtaptimestamp(asset + ".time_stamp", time)){
					print("ERROR: Not able to set timestamp of Pappa point!", serverId, 0);
				}
			}
			
			String status = DynAlgVal.rtap.readRtapVal(asset + ".status");
			if(!"0".equals(status)){
				if(!"1".equals(status)){
					DynAlgVal.rtap.writeRtapVal(asset + ".status", "1");
					String alarmAlias = DynAlgVal.rtap.readRtapVal(asset + ".alarmalias");
					DynAlgVal.rtap.writeRtapVal(alarmAlias + ".pv", "0");
				}
			}
		}
	}
	
	private void writeRtapVal(String alias, String numVal, long timeStamp, String serverId){
		if(DynAlgVal.rtap == null){
			DynAlgVal.rtap = new Rtap(DynAlgVal.isVerbose());
		}
		
		if(DynAlgVal.rtap != null){
			String offScan = DynAlgVal.rtap.readRtapVal(alias + ConstVal.RTAP_SOAP_CONFIG_PV_OFFSCAN_ATTRIBUTE);
			if("1".equals(offScan)){
				print("Starting to write rtap value to alias: " + alias + " with value: " + numVal, serverId, 2);
				if(!DynAlgVal.rtap.writeRtapVal(alias, numVal, timeStamp)){
					print("ERROR: Writing to Rtap went wrong for alias: " + alias + " val: " + numVal + " time: " + timeStamp, serverId, 0);
				}
			} else{
				print("WARNING: Point is not onscan.", serverId, 3);
			}
		}
	}
	
	private void writeOracleVal(AssetVal asVal, String numVal, long timeStamp, String serverId){
		if(DynAlgVal.rtap == null){
			DynAlgVal.rtap = new Rtap(DynAlgVal.isVerbose());
		}
		
		if(DynAlgVal.oracle == null){
			DynAlgVal.oracle = new Oracle(DynAlgVal.isVerbose());
		}
		
		if(DynAlgVal.rtap != null){
			if(asVal.getFcsId() == null && asVal.getAlias() != null){
				asVal.setFcsId(DynAlgVal.rtap.readRtapVal(asVal.getAlias() + ConstVal.RTAP_SOAP_CONFIG_FCSID_ATTRIBUTE));
				print("Set fcs id of " + asVal.getAlias() + " to: " + asVal.getFcsId(), serverId, 2);
			}
			
			if(asVal.getType() == null && asVal.getAlias() != null){
				asVal.setType(DynAlgVal.rtap.readRtapVal(asVal.getAlias() + ConstVal.RTAP_SOAP_CONFIG_TAMPLATEID_ATTRIBUTE));
				print("Set tamplate id of " + asVal.getAlias() + " to: " + asVal.getType(), serverId, 2);
			}
		}
		
		if(DynAlgVal.oracle != null){
			DynAlgVal.oracle.writeOracleValue(asVal.getFcsId(), numVal, asVal.getType(), timeStamp);
			DynAlgVal.oracle.flushOracleData(DynAlgVal.isVerbose());
		} else{
			print("ERROR: Oracle dead!!", serverId, 0);
		}
	}
	
	private long parseTimeToLong(String time){
		Date date;
		try {
			SimpleDateFormat formatter = new SimpleDateFormat(ConstVal.XML_DATE_TIME_FORMAT_1);
			date = formatter.parse(time);
			return date.getTime();
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return 0;
	}
			
	private Document translateInputStreamToDomModel(InputStream in) 
        throws IOException, ParserConfigurationException, SAXException {
        StringBuffer buf = new StringBuffer();
        StringBuffer tempBuf = new StringBuffer();
        boolean timeToCollect = false;
        
        int ch;
        while( (ch = in.read()) != -1 ) {
        	if(tempBuf.lastIndexOf(ConstVal.SOAP_START_MESSAGE) != -1 && !timeToCollect){
        		buf.append(ConstVal.SOAP_START_MESSAGE);
            	timeToCollect = true;
        	}
        	
            if (timeToCollect && ch == '\r') {
            	buf.append("\r\n");
                in.read();
            } else {
            	if(timeToCollect){
            		buf.append((char)ch);
            	} else{
            		tempBuf.append((char)ch);
            	}
            }
            
            if(buf.indexOf(ConstVal.SOAP_STOP_MESSAGE) != -1){
            	break;
            }
        }
        DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
		return dBuilder.parse(new InputSource(new StringReader(buf.toString())));
    }

	private static String getTagValue(String sTag, Element eElement) {
		NodeList nlList = eElement.getElementsByTagName(sTag).item(0).getChildNodes();
	 
		if(nlList.item(0) == null){
			return "";
		}

		Node nValue = (Node) nlList.item(0);
	 
		return nValue.getNodeValue();
	}
	
	private void print(String txt, String serverId, int level){
		if(DynAlgVal.isVerbose() && level <= debugLevel){
			String line = "";
	        if(serverId.equals("")){
	        	line += "MAIN_SERVER; " + txt;
	        } else{
	        	line += "SERVER_" + serverId + "; " + txt;
	        }
			System.out.println(line);
		}
	
		if(level <= logLevel){
			if(serverId.equals("")){
				Logger.log("[MAIN_SERVER]; " + txt);
			} else{
				Logger.log("[SERVER_" + serverId + "]; " + txt);
			}
		}
	}
	
	private boolean isInteger(String val){
		try{
			Integer.parseInt(val);
		} catch(NumberFormatException ex){
			return false;
		}
		
		return true;
	}

	@Override
	public void run() {
		try {
			startServer();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public void killServer(){
		print("Server received a termination call outside the serverThread", "", 0);
		runner = false;
		try {
			providerSocket.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public int getPortNumber() {
		return portNumber;
	}

	public void setPortNumber(int portNumber) {
		this.portNumber = portNumber;
	}
	
	public int getLogLevel() {
		return logLevel;
	}
	public void setLogLevel(int logLevel) {
		this.logLevel = logLevel;
		this.debugLevel = logLevel;
	}
}
