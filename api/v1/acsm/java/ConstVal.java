package value;

public class ConstVal {
	public static final String RTAP_BINDNAME									= "alarmRol";
	public static final int RTAP_PORT_NR										= 30210;
	
	public static final int SERVER_FIXED_LISTENPOORT							= 30070;
	public static final int SERVER_FIXED_LISTENPOORT_1							= 30006;
	public static final int CLIENT_FIXED_CONNECTPOORT							= 30400;  // Not used. (configured in Rtap)
	
	// Stop subscription
	public final static String STOP_SUBSCRIPTION_REQUEST_VALUE 					= "http://140.infra.imtech.eu/";
	public final static String STOP_SUBSCRIPTION_RESPONSE_CHECKVALUE 			= "StopSubscriptionResponse";
		
	// Subscribe
	public final static String SUBSCRIBE_REQUEST_VALUE							= "http://140.infra.imtech.eu/";
	public final static String SUBSCRIBE_RESPONSE_CHECKVALUE 					= "SubscribeResponse";
	public final static String SUBSCRIBE_CHILDNAME_VALUE						= "SubscribeRequestFilter";
		
	// Get Subscription state
	public final static String GET_SUBSCRIPTION_STATE_REQUEST_VALUE				= "GetSubscriptionState xmlns=\"http://140.infra.imtech.eu/\"";
	public final static String GET_SUBSCRIPTION_STATE_RESPONSE_CHECKVALUE 		= "GetSubscriptionStateResult";
			
	// Algemeen
	public final static Integer WATCHDOG_POLL_TIMEOUT							= 2000;
	public final static String XML_DATE_TIME_FORMAT_1							= "yyyy-MM-dd'T'HH:mm:ss";
	public final static String XML_DATE_TIME_FORMAT_2							= "yyyy-MM-dd HH:mm:ss";
	public final static String XML_DATE_TIME_FORMAT_3							= "dd-MM-yyyy HH:mm:ss";
	
	public final static String SUBSCRIPTION_STATE_NO_SUBSCRIPTION				= "0";
	public final static String SUBSCRIPTION_STATE_NO_SYNCHRONIZING				= "1";
	public final static String SUBSCRIPTION_STATE_NO_SYNCHRONIZED				= "2";
	public final static String SUBSCRIPTION_STATE_NO_SUBSCRIPTION_ERROR			= "3";
	
	public final static String RTAP_SOAP_SCANTABEL								= "SOAP_CONFIG.scan";
	public final static String RTAP_SOAP_CONFIG_POINT							= "SOAP_CONFIG";	
	
	public final static String RTAP_SOAP_CONFIG_IP_ATTRIBUTE					= ".ip_adres";
	public final static String RTAP_SOAP_CONFIG_PORT_ATTRIBUTE					= ".listen_port";
	public final static String RTAP_SOAP_CONFIG_WSDLPATH_ATTRIBUTE				= ".wsdl_path";
	public final static String RTAP_SOAP_CONFIG_SERVER_LISTEN_PORT_ATTRIBUTE	= ".CssServerListenPort";
	public final static String RTAP_SOAP_CONFIG_ELEMENT_BY_TAG_NAME_ATTRIBUTE	= ".ElementByTagName";
	public final static String RTAP_SOAP_CONFIG_SOAPANSWER_HEADER_ATTRIBUTE		= ".SoapAnswerHeader";
	public final static String RTAP_SOAP_CONFIG_LOCATION_ATTRIBUTE				= ".onderstationlocatie";
	public final static String RTAP_SOAP_CONFIG_SEND_LOCATION_ATTRIBUTE			= ".SendLocationOutput";
	public final static String RTAP_SOAP_CONFIG_SEND_GROUP_ATTRIBUTE			= ".SendGroupOutput";
	public final static String RTAP_SOAP_CONFIG_REPORT_URL_ATTRIBUTE			= ".CssServerAdres";
	public final static String RTAP_SOAP_CONFIG_SYSTEM_INSTANCE_ID_ATTRIBUTE	= ".SystemInstanceId";
	public final static String RTAP_SOAP_CONFIG_OFFSET_STARTDATE_ATTRIBUTE		= ".OffsetStartDate_day";
	public final static String RTAP_SOAP_CONFIG_PV_OFFSCAN_ATTRIBUTE			= ".pv_offscan";
	public final static String RTAP_SOAP_CONFIG_TIMESTAMP_ATTRIBUTE				= ".time_stamp";
	public final static String RTAP_SOAP_CONFIG_PV_ATTRIBUTE					= ".pv";
	public final static String RTAP_SOAP_CONFIG_ORACLE_ATTRIBUTE				= ".oracle";
	public final static String RTAP_SOAP_CONFIG_STATUS_ATTRIBUTE				= ".status";
	public final static String RTAP_SOAP_CONFIG_ONSCAN_ATTRIBUTE				= ".on_scan";
	public final static String RTAP_SOAP_CONFIG_FCSID_ATTRIBUTE					= ".FCS_id";
	public final static String RTAP_SOAP_CONFIG_TAMPLATEID_ATTRIBUTE			= ".template_id";
	
	public final static String SOAP_SUBSCRIBE_LOCATION_ATTRIBUTE				= "Location";
	public final static String SOAP_SUBSCRIBE_SEND_LOCATION_ATTRIBUTE			= "SendLocationStandardOutput";
	public final static String SOAP_SUBSCRIBE_SEND_GROUP_ATTRIBUTE				= "SendGroupStandardOutput";
	public final static String SOAP_SUBSCRIBE_REPORT_URL_ATTRIBUTE				= "ReportURL";
	public final static String SOAP_SUBSCRIBE_SYSTEM_INSTANCE_ID_ATTRIBUTE		= "SystemInstanceID";
	public final static String SOAP_SUBSCRIBE_START_DATE_ATTRIBUTE				= "StartDate";
	public final static String SOAP_SUBSCRIBE_STOP_DATE_ATTRIBUTE				= "EndDate";
	
	public final static String SOAP_SERVER_ATTRIBUTE_LOG_ID						= "LogID";
	public final static String SOAP_SERVER_ATTRIBUTE_SYSTEMINSTANCE_ID			= "SystemInstanceID";
	public final static String SOAP_SERVER_ATTRIBUTE_GROUP_ID					= "GroupID";
	public final static String SOAP_SERVER_ATTRIBUTE_LOCATION_ID				= "LocationID";
	public final static String SOAP_SERVER_ATTRIBUTE_TAG_ID						= "TagID";
	public final static String SOAP_SERVER_ATTRIBUTE_LOGTYPE					= "LogType";
	public final static String SOAP_SERVER_ATTRIBUTE_TEXTUAL_VALUE				= "TextualValue";
	public final static String SOAP_SERVER_ATTRIBUTE_NUMERIC_VALUE				= "NumericValue";
	public final static String SOAP_SERVER_ATTRIBUTE_TIMESTAMP					= "TimeStamp";
	public final static String SOAP_SERVER_ATTRIBUTE_QUALITY					= "Quality";
	public final static String SOAP_SERVER_ATTRIBUTE_STANDARD_OUTPUT			= "StandardOutput";
	
	// I/O typen in scantabel
	public static final String RTAP_IOTYPE_BITIN     							= "BIT_IN";
	public static final String RTAP_IOTYPE_BITOUT    							= "BIT_IN_OUT";
	public static final String RTAP_IOTYPE_ANALOGIN  							= "ANALOG_IN";
	public static final String RTAP_IOTYPE_ANALOGOUT 							= "ANALOG_IN_OUT";
	
	// Event typen
	public final static String RTAP_EVENT_OUTPUT     							= "OUTPUT";
	public final static String RTAP_EVENT_OSSCAN     							= "OSSCAN";
	public final static String RTAP_EVENT_SCANMODE   							= "SCANMODE";
	public final static String RTAP_EVENT_SCANQUEUE  							= "SCANQUEUE";
	public final static String RTAP_EVENT_LOGLEVEL   							= "LOGLEVEL";
	
	// Algemeen
	public final static String SOAP_START_MESSAGE								= "<?xml";
	public final static String SOAP_STOP_MESSAGE								= "</soap:Envelope>";
	
	public final static String ORACLE_DB_GROUP									= "macs_p";
	public final static String ORACLE_PATH 										= "/apps/acsm/buffer/misclogbuffer/local";
	public final static String PREFIX_ORACLE 									= "BST###.";
} 
