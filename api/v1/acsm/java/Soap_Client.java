package soap.client;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

import javax.xml.soap.MessageFactory;
import javax.xml.soap.SOAPBody;
import javax.xml.soap.SOAPConnection;
import javax.xml.soap.SOAPConnectionFactory;
import javax.xml.soap.SOAPConstants;
import javax.xml.soap.SOAPElement;
import javax.xml.soap.SOAPEnvelope;
import javax.xml.soap.SOAPException;
import javax.xml.soap.SOAPMessage;
import javax.xml.soap.SOAPPart;

import value.ConstVal;
import value.DynAlgVal;
import value.DynAssetVal;
import value.SoapValueElement;

public class Soap_Client {
	private DynAssetVal dynAssVal;
	
	public void setConfiguration(DynAssetVal dynAssVal){
		this.dynAssVal = dynAssVal;
	}
	
	public boolean stopSubscription(){
		boolean returnValue = false;
		String url = getWsdlUrl();
		
		if(url != null){
			SOAPMessage soapSentMessage = createValueSoapMessage("StopSubscription",ConstVal.STOP_SUBSCRIPTION_REQUEST_VALUE, "", null);
			SOAPMessage soapReceiveMessage = getResponse(soapSentMessage, url);
			SOAPBody body = null;
			
			if(soapReceiveMessage != null){
				try {
					body = soapReceiveMessage.getSOAPBody();
					if(ConstVal.STOP_SUBSCRIPTION_RESPONSE_CHECKVALUE.equals(body.getLastChild().getLocalName())){
						returnValue = true;
					}
				} catch (SOAPException e) {
					e.printStackTrace();
				}
	
				try {
					if(DynAlgVal.isVerbose()){
						soapSentMessage.writeTo(System.out);
						System.out.println("\n");
						soapReceiveMessage.writeTo(System.out);
						System.out.println("\n");
					}
				} catch (SOAPException e) {
					e.printStackTrace();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		
		return returnValue;
	}
	
	public boolean subscribe(){
		String url = getWsdlUrl();
		
		ArrayList<SoapValueElement> valueList = new ArrayList<SoapValueElement>();
		valueList.add(new SoapValueElement(ConstVal.SOAP_SUBSCRIBE_LOCATION_ATTRIBUTE, dynAssVal.getLocation()));
		valueList.add(new SoapValueElement(ConstVal.SOAP_SUBSCRIBE_SEND_LOCATION_ATTRIBUTE, dynAssVal.getSendLocationStandardOutput()));
		valueList.add(new SoapValueElement(ConstVal.SOAP_SUBSCRIBE_SEND_GROUP_ATTRIBUTE, dynAssVal.getSendGroupStandardOutput()));
		valueList.add(new SoapValueElement(ConstVal.SOAP_SUBSCRIBE_REPORT_URL_ATTRIBUTE, dynAssVal.getReportURL()));
		valueList.add(new SoapValueElement(ConstVal.SOAP_SUBSCRIBE_SYSTEM_INSTANCE_ID_ATTRIBUTE, dynAssVal.getSystemInstanceID()));

		
		valueList.add(new SoapValueElement(ConstVal.SOAP_SUBSCRIBE_START_DATE_ATTRIBUTE, time(Integer.parseInt(dynAssVal.getOffsetOfStartDate())*-1, ConstVal.XML_DATE_TIME_FORMAT_1)));
		valueList.add(new SoapValueElement(ConstVal.SOAP_SUBSCRIBE_STOP_DATE_ATTRIBUTE, time(0, ConstVal.XML_DATE_TIME_FORMAT_1)));
		
		SOAPMessage soapMessage = createValueSoapMessage("Subscribe", ConstVal.SUBSCRIBE_REQUEST_VALUE, ConstVal.SUBSCRIBE_CHILDNAME_VALUE, valueList);
		SOAPMessage soapReceiveMessage = getResponse(soapMessage, url);
		
		if(soapReceiveMessage != null){
			SOAPBody body = null;
			try {
				body = soapReceiveMessage.getSOAPBody();
				if(ConstVal.SUBSCRIBE_RESPONSE_CHECKVALUE.equals(body.getLastChild().getLocalName())){
					print("Response value is correct");
				}
			} catch (SOAPException e) {
				e.printStackTrace();
				return false;
			}
			
			try {
				if(DynAlgVal.isVerbose()){
					soapMessage.writeTo(System.out);
					System.out.println("\n");
					soapReceiveMessage.writeTo(System.out);
					System.out.println("\n");
				}
			} catch (SOAPException e) {
				e.printStackTrace();
				return false;
			} catch (IOException e) {
				e.printStackTrace();
				return false;
			}
		} else{
			return false;
		}
		return true;
	}
	
	public String getSubscriptionState(){
		String returnValue = null;
		String url = getWsdlUrl();
		
		if(url != null){
			SOAPMessage soapSentMessage = createLeanSoapMessage(ConstVal.GET_SUBSCRIPTION_STATE_REQUEST_VALUE);
			SOAPMessage soapReceiveMessage = getResponse(soapSentMessage, url);
			SOAPBody body = null;
			if(soapReceiveMessage != null){
				try {
					body = soapReceiveMessage.getSOAPBody();
					if(ConstVal.GET_SUBSCRIPTION_STATE_RESPONSE_CHECKVALUE.equals(body.getLastChild().getLastChild().getLocalName())){
						returnValue	= body.getLastChild().getLastChild().getTextContent();
					}
				} catch (SOAPException e) {
					e.printStackTrace();
				}
		
				if(DynAlgVal.isVerbose()){
					try {
						soapSentMessage.writeTo(System.out);
						System.out.println("\n");
						soapReceiveMessage.writeTo(System.out);
						System.out.println("\n");
					} catch (SOAPException e) {
						e.printStackTrace();
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
			}
		}
		
		return returnValue;
	}
	
	private String time(int daydOffest, String timeFormat){
		Date date = new Date();
		
		SimpleDateFormat formatter = new SimpleDateFormat(timeFormat);
		String format = formatter.format(date);
		
		if(daydOffest != 0){
			try {
				Calendar c = Calendar.getInstance(); 
				c.setTime(formatter.parse(format));
				c.add(Calendar.DATE, daydOffest);  
				format = formatter.format(c.getTime());
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		
		return format;
	}
	
	private String getWsdlUrl(){
		if(dynAssVal.getIpAdresBaanStation() != null){
			String returnValue = "http://";
			returnValue += dynAssVal.getIpAdresBaanStation();
				
			if(dynAssVal.getListenportBaanStation() != null){
				returnValue += (":" + dynAssVal.getListenportBaanStation());
				returnValue += (dynAssVal.getWsdlPath());
				
				print("Connection URL: " + returnValue);
				return returnValue;
			}
		}
		
		return null;
	}
	
	
	
	
	
	
	
	public SOAPMessage createLeanSoapMessage(String value){
		SOAPMessage soapMessage = null;
		
		try{
	        MessageFactory messageFactory = MessageFactory.newInstance(SOAPConstants.SOAP_1_2_PROTOCOL);   
	        soapMessage = messageFactory.createMessage();   
	        SOAPPart soapPart = soapMessage.getSOAPPart();   
	        SOAPEnvelope soapEnvelop = soapPart.getEnvelope(); 
	        
	        soapEnvelop.getHeader().detachNode();
	        soapEnvelop.setPrefix("soap12");
	        soapEnvelop.addNamespaceDeclaration("xsi","http://www.w3.org/2001/XMLSchema-instance");
	        soapEnvelop.addNamespaceDeclaration("xsd","http://www.w3.org/2001/XMLSchema");
	        
	        SOAPBody soapBody = soapEnvelop.getBody(); 
	        soapBody.setPrefix("soap12");
	        
	        soapBody.addBodyElement(soapEnvelop.createName(value));
	        
	        soapMessage.saveChanges();   
		}catch (Exception e) {   
            e.printStackTrace();   
        }
		
		return soapMessage;
	}
	
	
	
	public SOAPMessage createValueSoapMessage(String header, String adress, String childName, ArrayList<SoapValueElement> valueList){
		SOAPMessage soapMessage = null;
		
		try{
	        MessageFactory messageFactory = MessageFactory.newInstance(SOAPConstants.SOAP_1_2_PROTOCOL);   
	        soapMessage = messageFactory.createMessage();   
	        SOAPPart soapPart = soapMessage.getSOAPPart();   
	        SOAPEnvelope soapEnvelop = soapPart.getEnvelope();  
	        
	        soapEnvelop.getHeader().detachNode();
	        soapEnvelop.setPrefix("soap12");
	        soapEnvelop.addNamespaceDeclaration("xsi","http://www.w3.org/2001/XMLSchema-instance");
	        soapEnvelop.addNamespaceDeclaration("xsd","http://www.w3.org/2001/XMLSchema");
	        
	        SOAPBody soapBody = soapEnvelop.getBody(); 
	        soapBody.setPrefix("soap12");
	        
	        // change: 22-10-2012 by PJ Anker t.b.v. CDF
	        //SOAPElement firstSoapElement = soapBody.addChildElement(soapEnvelop.createName("Subscribe", "", "http://140.infra.imtech.eu/"));
	        SOAPElement firstSoapElement = soapBody.addChildElement(soapEnvelop.createName(header, "", adress));
	        SOAPElement secondSoapElement = null;
	        
	        if(childName != null && !"".equals(childName)){
	        	secondSoapElement = firstSoapElement.addChildElement(childName);
	        	//secondSoapElement.addChildElement("1").addTextNode("2");
	        }
	        
	        if(null != valueList){
		        for(SoapValueElement val : valueList){
		        	if(secondSoapElement != null){
		        		secondSoapElement.addChildElement(val.getAttribute()).addTextNode(val.getValue());
		        	} else{
		        		firstSoapElement.addChildElement(val.getAttribute()).addTextNode(val.getValue());
		        	}
		        }
	        }
	        
	        soapMessage.saveChanges();  

		}catch (Exception e) {   
            e.printStackTrace();   
        }
		
		return soapMessage;
	}
	
	public SOAPMessage getResponse(SOAPMessage soapMessage, String url){
		SOAPMessage response = null;
		
		try{
			SOAPConnectionFactory soapConnFac = SOAPConnectionFactory.newInstance();   
	        SOAPConnection soapCon = soapConnFac.createConnection();  
			response = soapCon.call(soapMessage, url);   
		}catch (Exception e) {   
            e.printStackTrace();   
        }
		
		return response;
	}
	
	private void print(String val){
		if(DynAlgVal.isVerbose()){
			System.out.println(val);
		}
	}
}
