/*
	LogType:
		TagAttribute|SystemInstanceSumAlarm|SystemInstanceSumState|GroupSumAlarm|GroupSumState|LocationSumAlarm|LocationSumState|SystemInstanceSO_CriticalFailure|SystemInstanceSO_NonCriticalFailure|SystemInstanceSO_Locking|SystemInstanceSO_Maintenance|SystemInstanceSO_Running|
		SystemInstanceSO_RunningMode|SystemInstanceSO_Security|SystemInstanceSO_PreWarning_1|SystemInstanceSO_PreWarning_2|SystemInstanceSO_PreWarning_3|TagSO_Measurement_1|TagSO_Measurement_2|TagSO_Measurement_3|TagSO_Measurement_4|TagSO_Measurement_5|
		GroupSO_CriticalFailure|GroupSO_NonCriticalFailure|GroupSO_Locking|GroupSO_Maintenance|GroupSO_Running|GroupSO_RunningMode|GroupSO_Security|GroupSO_PreWarning_1|GroupSO_PreWarning_2|GroupSO_PreWarning_3|LocationSO_CriticalFailure|LocationSO_NonCriticalFailure|LocationSO_Locking|
		LocationSO_Maintenance|LocationSO_Running|LocationSO_RunningMode|LocationSO_Security|LocationSO_PreWarning_1|LocationSO_PreWarning_2|LocationSO_PreWarning_3|SystemInstanceSO_MeasurementErrorFlag|GroupSO_MeasurementErrorFlag|LocationSO_MeasurementErrorFlag|TagSO_RunningMode
	Quality:
		NotValid,CommunicationError,UnInitialized
	StandardOutput:
		CriticalFailure|NonCriticalFailure|Running|RunningMode|PreWarning_1|PreWarning_2|PreWarning_3|Security|Locking|Maintenance|Measurement_1|Measurement_2|Measurement_3|Measurement_4|Measurement_5|MeasurementErrorFlag
*/

function getUrl(method, url, formdata) {
	response.innerText = JSON.stringify({ method: method, url: url, formdata: formdata }, null, 2);
	console.log({ method: method, url: url, formdata: formdata });
	var xhr = new XMLHttpRequest();
	xhr.open(method, xhr.url = url, true);
	xhr.onreadystatechange = function () {
		if (this.readyState == 4) {
			if (this.status == 200) {
				console.log(this.url, this.responseText);
				response.innerText = this.responseText;
			}
		}
	}
	xhr.send(formdata);
}

