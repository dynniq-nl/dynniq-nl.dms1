console.log('DMS');
var checkTemperatuur = function () {
	this.tempHigh.conditie = this.temperatuur_actueel.Value > this.temperatuur_actueel.High;
	this.temperatuurHighHigh.conditie = this.temperatuur_actueel.Value > this.temperatuur_actueel.HighHigh;
	this.temperatuur_hoog.conditie = this.temperatuur_actueel.Value > this.temperatuur_actueel.High;
	this.temperatuur_hoog.conditie = this.temperatuur_actueel.Value > this.temperatuur_actueel.High;
}
Aim.assign({
	client: {
	},
	stereotype: {
		configuratie_element: {
			label: 'Configuratie elementen',
		},
		commando: {
			label: "Commando's",
		},
		toestandsvariabele: {
			label: 'Toestandsvariabelen',
		},
		variabele: {
			label: 'Variabelen',
		},
		bediening: {
			label: 'Bedieningen',
		},
		besturing: {
			label: 'Besturingen',
		},
		signalering: {
			label: 'Signaleringen',
		},
		autonoom_proces: {
			label: 'Autonoom processen',
		}
	},
	config: {
	},
	definitions: {
		ConstanteStroomRegelaar: {
			properties: {
				temperatuur_gemeten: {
					stereotype: 'variabele',
				},
				temperatuur_actueel: {
					stereotype: 'variabele',
				},
			},
			operations: {
				autoTemp: { js: checkTemperatuur, }
			}
		},
		TemperatuurMeting: {
			properties: {
				TempVochtSensor: {

				},
				temperatuur_raw: {
					label: "DMS",
					onchange: function (event) {
						this.item.setAttribute('temperatuur', this.value / 10);
						console.log(this);
					},
				},
				temperatuur: {
					label: "DMS",
					onchange: function (event) {
						console.log(this);
					},
				},
				vochtigheid: {
					label: "DMS",
					onchange: function (event) {
						console.log(this);
					},
				},
				alarm_setpoint: {
					label: "DMS",
				},
				alarm_hoog: {
					conditie: function () {
						return this.TempVochtSensor.temperatuur > this.TempVochtSensor.temperatuur_max;
					}
				},
			},
			operations: {
				autoproc: {
					autoTemp: { js: checkTemperatuur, },
					em: function () {
						this.temperatuur_actueel = this.TempVochtSensor.temperatuur / this.TempVochtSensor.factor;
						this.alarm_hoog = this.TempVochtSensor.temperatuur > this.TempVochtSensor.temperatuur_max;
					}
				},
			},
		},
		TempVochtSensor: {
			properties: {
				factor: {
					initdefaulvalue: 10,
				},
				ReadRegisterStart: {
					initdefaulvalue: 48,
				},
				ReadRegisterLength: {
					initdefaulvalue: 2,
				},
				temperatuur_min: {
					label: "DMS",

				},
				temperatuur_max: {
					label: "DMS",
				},
				temperatuur: {
					label: "DMS",
				},
				vochtigheid: {
					label: "DMS",
				},
			},
			operations: {
			},
		},
		dms_Location: {
			className: 'Location',
			properties: {
				intLocationID: { label: "DMS Location", placeholder: "LocationID", idname: "tag" },
				strLocation: { placeholder: "Location", kop: 0, default: 1 },
				intRelease: { placeholder: "Release" },
				blnValidated: { placeholder: "Validated" },
				blnAccepted: { placeholder: "Accepted" },

				CriticalFailure: {},
				NonCriticalFailure: {},
				Locking: {},
				Maintenance: {},
				Running: {},
				RunningMode: {},
				Security: {},
				PreWarning_1: {},
				PreWarning_2: {},
				PreWarning_3: {},
				MeasurementErrorFlag: {},
			}
		},
		dms_Group: {
			className: 'share',
			properties: {
				intGroupID: { label: "DMS Group", placeholder: "GroupID", idname: "tag" },
				intLocationID: { placeholder: "LocationID" },
				strGroupName: { placeholder: "Groupname", kop: 0, default: 1 },
				intParentID: { placeholder: "ParentID" },
				strDescription: { placeholder: "Description" },

				CriticalFailure: {},
				NonCriticalFailure: {},
				Locking: {},
				Maintenance: {},
				Running: {},
				RunningMode: {},
				Security: {},
				PreWarning_1: {},
				PreWarning_2: {},
				PreWarning_3: {},
				MeasurementErrorFlag: {},
			},
		},
		dms_Place: {
			properties: {
				intPlaceID: { label: "Place", placeholder: "PlaceID", idname: "tag" },
				strPlace: { placeholder: "Place", kop: 0, default: 1 },
				strDescription: { placeholder: "Description" },
			},
		},
		dms_ModbusTCPDevice: {
			className: "Product",
			properties: {
				intModbusTCPDeviceID: { label: "Modbus TCP Device", placeholder: "ModbusTCPDeviceID", idname: "tag" },
				strIPAddress: { placeholder: "IP address", kop: 0, default: 1 },
				intPortNr: { placeholder: "Port number", type: "number", kop: 0 },
				intConnectionTimeout: { placeholder: "Connection Timeout", type: "number" },
				intResponseTimeout: { placeholder: "Response Timeout", type: "number" },
				intUnitID: { placeholder: "UnitID" },
			},
		},
		dms_SNMPDevice: {
			className: "Product",
			properties: {
				intSNMPDeviceID: { label: "SNMP Device", placeholder: "SNMPDeviceID", idname: "tag" },
				strIPAddress: { placeholder: "IP address", kop: 0, default: 1 },
				intPortNr: { placeholder: "Port number", type: "number", kop: 0 },
				intTimeoutMS: { placeholder: "Timeout MS", type: "number" },
				strCommunity: { placeholder: "Community", kop: 2 },
			},
		},
		dms_System: {
			className: 'System',
			attributes: {
				intSystemID: { label: "DMS System", placeholder: "SystemID", idname: "tag", },
				strSystemName: { placeholder: "System Name", kop: 0, default: 1 },
				strEndianess: { placeholder: "Endianess", options: { Little: { title: "Little" }, Big: { title: "Big" } } }, // Little, Big >> Byteswap
				strDescription: { placeholder: "Description", kop: 1, },
				intVersion: { placeholder: "Version", type: "number" },
				blnValidated: { placeholder: "Validated", type: "checkbox" },
				blnAccepted: { placeholder: "Accepted", type: "checkbox" },
				intPlaceID: { placeholder: "PlaceID" },
			},
		},
		dms_SystemInstance: {
			className: 'System',
			properties: {
				intSystemInstanceID: { label: "System Instance", placeholder: "SystemInstanceID", idname: "tag" },
				intGroupID: { placeholder: "GroupID" },
				intsystemID: { placeholder: "SystemID", schema: "dms_System", idname: "srcID" },
				intPlaceID: { placeholder: "PlaceID" },
				strSystemInstanceName: { placeholder: "System Instance Name", kop: 0 },
				intModbusTCPDeviceID: { placeholder: "ModbusTCPDeviceID" },
				intSNMPDeviceID: { placeholder: "SNMPDeviceID" },
			},
		},
		dms_SetpointAlarmSetting: {
			properties: {
				intSetpointAlarmSettingID: { label: "Setpoint Alarm", placeholder: "SetpointAlarmSettingID", idname: "tag" },
				intSetPointAlarmID: { placeholder: "SetPointAlarmID" },
				intSystemInstanceID: { placeholder: "SystemInstanceID" },
				fltBoundaryValue: { placeholder: "BoundaryValue", type: "number" },
				fltHysteresis: { placeholder: "Hysteresis", type: "number" },
			},
		},
		dms_Tag: {
			className: 'attribute',
			properties: {
				intTagID: { label: "Tag", placeholder: "TagID", idname: "tag" },
				intSystemID: { placeholder: "SystemID", schema: "dms_System", itemAttribute: "tag" },//itemID:2134132412341,
				strTagName: { placeholder: "Tagname", kop: 0 },
				strTagType: { placeholder: "Tagtype" },
				intSharedMemoryOffset: { placeholder: "Shared Memory Offset", type: "number" },
				intSharedMemoryBit: { placeholder: "Shared Memory Bit", type: "number" },
				strTextEnumeration: { placeholder: "Text enumeration" },
				strDescription: { placeholder: "Description", kop: 1 },
				bitPassthrough: { placeholder: "Passthrough" },
				fltMinRawValue: { placeholder: "Min Raw Value", type: "number" },
				fltMaxRawValue: { placeholder: "Max Raw Value", type: "number" },
				fltMinEngValue: { placeholder: "Min Engineering Value", type: "number" },
				fltMaxEngValue: { placeholder: "Max Engineering Value", type: "number" },
				strUnit: { placeholder: "Unit" },
				intFraction: { placeholder: "Fraction", type: "number" },
				strIOType: { placeholder: "IO Type" },
				chkInvert: { placeholder: "Invert" },
				strAlarmText: { placeholder: "Alarm Text" },
				intCategory: { placeholder: "Category" },
				fltHysteresis: { placeholder: "Hysteresis", type: "number" },
				strStandardOutput: { placeholder: "Standard Output" },
				intModbusAddress: { placeholder: "Modbus Address", type: "number" },
				intModbusAddressBit: { placeholder: "Modbus Address Bit", type: "number" },
				strRangeName: { placeholder: "Range Name" },
			},
		},
		dms_ModbusTCPRange: {
			className: "iomodule",
			properties: {
				intModbusTCPRangeID: { label: "Modbus TCP Range", placeholder: "ModbusTCPRangeID", idname: "tag" },
				intSystemID: { placeholder: "SystemID" },
				strRangeName: { placeholder: "Range Name", kop: 0 },
				chrReadWriteMode: { placeholder: "ReadWriteMode" },
				intModbusTCPStartAddress: { placeholder: "Modbus TCP StartAddress", type: "number" },
				intDataLength: { placeholder: "Data Length", type: "number" },
				intSharedMemoryOffset: { placeholder: "Shared Memory Offset", type: "number" },
				strDescription: { placeholder: "Description", kop: 0 },
				intPollIntervalMS: { placeholder: "Poll Interval MS", type: "number" },
				intUnitID: { placeholder: "UnitID" },
				intMemoryBank: { placeholder: "MemoryBank" },
			},
		},
		dms_tblSetPointAlarm: {
			properties: {
				intSetPointAlarmID: { label: "Setpoint Alarm ID", placeholder: "SetPointAlarmID", idname: "tag", kop: 0 },
				strDescription: { placeholder: "Description", kop: 1 },
				intSourceTagID: { placeholder: "SourceTagID" },
				intDestinationTagID: { placeholder: "DestinationTagID" },
				strType: { placeholder: "Type" },
			},
		},
		dms_SNMPItem: {
			properties: {
				intSNMPItemID: { label: "SNMP Item ID", placeholder: "SNMPItemID", idname: "tag", kop: 0 },
				intSystemID: { placeholder: "SystemID" },
				strOID: { placeholder: "OID" },
				strDescription: { placeholder: "Description", kop: 1 },
				intSharedMemoryOffset: { placeholder: "Shared Memory Offset", type: "number" },
				intPollInterval: { placeholder: "Poll Interval", type: "number" },
				strSNMPType: { placeholder: "SNMP Type" },
				intColumnNumber: { placeholder: "Column Number" },
				strSNMPRange: { placeholder: "SNMP Range" },
			},
		},
	},
	navleft: {
		items: {
			DMSgeneric: {
				className: "se", title: "DMS Generic", items: {
					System: { title: "System", get: { title: "System", folder: "dms_System", id: '', q: '*', order: '' }, },
					Tag: { title: "Tag", get: { title: "Tag", folder: "dms_Tag", id: '', q: '*', order: '' }, },
					ModbusTCPRanges: { title: "ModbusTCPRanges", get: { title: "ModbusTCPRanges", folder: "dms_ModbusTCPRange", id: '', q: '*', order: '' }, },
					tblSetPointAlarm: { title: "tblSetPointAlarm", get: { title: "tblSetPointAlarm", folder: "dms_tblSetPointAlarm", id: '', q: '*', order: '' }, },
					SNMPItem: { title: "SNMPItem", get: { title: "SNMPItem", folder: "dms_SNMPItem", id: '', q: '*', order: '' }, },
				}
			},
			DMSspecific: {
				className: "se", title: "DMS Specific", items: {
					Location: { title: "Location", get: { title: "Location", folder: "dms_Location", id: '', q: '*', order: '' }, },
					Group: { title: "Group", get: { title: "Group", folder: "dms_Group", id: '', q: '*', order: '' }, },
					Place: { title: "Place", get: { title: "Place", folder: "dms_Place", id: '', q: '*', order: '' }, },
					ModbusTCPDevice: { title: "ModbusTCPDevice", get: { title: "ModbusTCPDevice", folder: "dms_ModbusTCPDevice", id: '', q: '*', order: '' }, },
					SNMPDevice: { title: "SNMPDevice", get: { title: "SNMPDevice", folder: "dms_SNMPDevice", id: '', q: '*', order: '' }, },
					SystemInstance: { title: "SystemInstance", get: { title: "SystemInstance", folder: "dms_SystemInstance", id: '', q: '*', order: '' }, },
					SetpointAlarmSetting: { title: "SetpointAlarmSetting", get: { title: "SetpointAlarmSetting", folder: "dms_SetpointAlarmSetting", id: '', q: '*', order: '' }, },
				}
			},
			DMS: {
				className: "se", title: "DMS", items: {
					dmsSystem: { title: "DMS Systems", get: { title: "DMS Systems", folder: "dmsSystem", id: '', q: '*', order: '' }, },
					dmsModbusTCPRange: { title: "DMS ModbusTCPRange", get: { title: "DMS ModbusTCPRange", folder: "dmsModbusTCPRange", id: '', q: '*', order: '' }, },
					dmsTag: { title: "DMS Tag", get: { title: "DMS Tag", folder: "dmsTag", id: '', q: '*', order: '' }, },
					dmsAlarm: { title: "DMS Alarm", get: { title: "DMS Alarm", folder: "dmsAlarm", id: '', q: '*', order: '' }, },
					dmsMeasurment: { title: "DMS Measurment", get: { title: "DMS Measurment", folder: "dmsMeasurment", id: '', q: '*', order: '' }, },
					dmsStatus: { title: "DMS Status", get: { title: "DMS Status", folder: "dmsStatus", id: '', q: '*', order: '' }, },
					dmsSetpointAlarm: { title: "DMS SetpointAlarm", get: { title: "DMS SetpointAlarm", folder: "dmsSetpointAlarm", id: '', q: '*', order: '' }, },
					dmsStation: { title: "DMS Station", get: { title: "DMS Station", folder: "dmsStation", id: '', q: '*', order: '' }, },
				}
			},
		}
	},
});
