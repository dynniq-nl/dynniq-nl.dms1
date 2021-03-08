# ACSM Interface

## Algemeen
- Functies en classes zijn case-unsensitive binnen php

## Setup
### Web.config 
Bestand uitbreiden met
```
	<system.webServer>
		<rewrite>
			<rules>
				<!-- ALLEEN OP SERVER ALICONNECT -->
				<rule name="MonitoringSystemWebservice" stopProcessing="true">
					<match url="^MonitoringSystemWebservice(.*)" />
					<action type="Rewrite" url="/sites/dms/api/v1/acsm/server.php" appendQueryString="true" />
				</rule>
```
### acsm database
SQL Server uitbreiden met acsm database voor opslaan acsm database

	Dit is een SOAP aanroep die niet wordt gezien door de PHP soap Server. Deze worden afgevangen en de reply wordt als XML opgebouwd.
	Alleen bij de ACSM SOAP Call is de $headers["Content-Type"]==="application/soap+xml; charset=utf-8"
	bij een SOAP call van een SOAP SERVER is deze ==="application/soap+xml; charset=utf-8; action="http://sites/dms/api/v1/SoapAcsmTest.php#GetSubscriptionState""

Deze functie wordt niet uitgevoerd omdat de StopSubscription wordt afgevangen als HTML.
Het DMS stuurt namelijk geen correct SOAP bericht waardoor de SOAP server het bericht niet verwerkt. zie code boven
De response wordt als XML string opgebouwd.

	Bij een WSDL SOAP SERVER is de response: <env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope" xmlns:ns1="http://imtech.eu/"><env:Body><ns1:GetSubscriptionStateResponse><ns1:GetSubscriptionStateResult>Stopped</ns1:GetSubscriptionStateResult></ns1:GetSubscriptionStateResponse></env:Body></env:Envelope>
	Bij een NON WSDL SOAP SERVER is de response: <env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope" xmlns:ns1="http://192.168.1.201:30070/MonitoringSystemWebservice/LocalMonitoringWebservice.asmx" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:ns2="http://xml.apache.org/xml-soap" xmlns:enc="http://www.w3.org/2003/05/soap-encoding"><env:Body xmlns:rpc="http://www.w3.org/2003/05/soap-rpc"><ns1:GetSubscriptionStateResponse env:encodingStyle="http://www.w3.org/2003/05/soap-encoding"><rpc:result>return</rpc:result><return xsi:type="ns2:Map"><item><key xsi:type="xsd:string">GetSubscriptionStateResult</key><value xsi:type="xsd:string">Stopped</value></item></return></ns1:GetSubscriptionStateResponse></env:Body></env:Envelope>
	Er moet dus een WSDL SOAP Server worden gebruikt voor de correcte response
	Deze functie wordt ECHTER niet uitgevoerd omdat de GetSubscriptionState wordt afgevangen als HTML. 
	Het DMS stuurt namelijk geen correct SOAP bericht waardoor de SOAP server het bericht niet verwerkt. zie code boven
	De response wordt als XML string opgebouwd. En dus correct opgebrouwd.
	Hierdoor kan gewerkt worden met een NON-WSDL (mits er geen andere berichten verkeerd worden opgebouwd).

    Onderstaande client is nodig in productie omgeving en werkt met de ACSM SOAP Server
    Het aanroepen van een functie op de ACSM SOAP server werkt niet. 
    Dit lukt alleen met een zelf opgebouwde XML string en een SoapVar
    Opbouwen XML string is gebaseerd op ontvangen input object, Deze functionaliteit is specifiek voor een WebLogItemArray gemaakt.

## Configuratie
### DMS J2
- IP:  
### ACSM
- IP:


## Interface DMS SOAP Client naar ACSM SOAP Server

Wordt afgehandeld door server.php

### Functies beschikbaar binnen DMS SOAP Server

#### StopSubscription()

#### GetSubscriptionState()

#### Subscribe()

## Afhandeling HTTP Request door ACSM



## Interface ACSM SOAP Client naar DMS SOAP Server
Wordt afgehandeld door client.php

### Functies beschikbaar bij ACSM Soap server

#### ReportChanges(xml)





### Proces afloop na wegvallen communicatie

1. StopSubscription
1. Delay 60 seconds
1. StopSubscription
1. GetSubscriptionState
1. Delay 5 seconds
1. Subscribe
1. Delay 5x60 seconds
Herhaal vanaf stap 1







