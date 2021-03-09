const AttributeTypeFilter = {
	CriticalFailure: { filtertype: "alarm", stateButton: "CriticalFailure" },
	NonCriticalFailure: { filtertype: "alarm", stateButton: "NonCriticalFailure" },
	Locking: { filtertype: "alarm", stateButton: "NonCriticalFailure" },
	Maintenance: { filtertype: "alarm", stateButton: "NonCriticalFailure" },
	Running: { filtertype: "state", stateButton: "Running" },
	RunningMode: { filtertype: "state", stateButton: "Running" },
	Security: { filtertype: "alarm", stateButton: "NonCriticalFailure" },
	PreWarning_1: { filtertype: "alarm", stateButton: "Warning" },
	PreWarning_2: { filtertype: "alarm", stateButton: "Warning" },
	PreWarning_3: { filtertype: "alarm", stateButton: "Warning" },
	Measurement_1: { filtertype: "measurement", stateButton: "" },
	Measurement_2: { filtertype: "measurement", stateButton: "" },
	Measurement_3: { filtertype: "measurement", stateButton: "" },
	Measurement_4: { filtertype: "measurement", stateButton: "" },
	Measurement_5: { filtertype: "measurement", stateButton: "" },
	MeasurementErrorFlag: { filtertype: "measurement", stateButton: "" },
}

for (var attributeName in AttributeTypeFilter) AttributeTypeFilter[attributeName].checked = 1;
itemList = [];
writefilter = function () {
	for (var i = 0, el, c = document.body.getElementsByClassName('his') ; el = c[i]; i++) el.removeAttribute("checked");
	document.getElementById(hisButtonId).setAttribute("checked", "");
	with (list) {
		innerText = "";
		Aim.listData.forEach(function (row) {
			var item = Aim.api.item[row.id];
      console.log(item);
			if (!item || itemList.indexOf(Number(item.id)) == -1) return;
			if (!item.AttributeType || !AttributeTypeFilter[item.AttributeType] || AttributeTypeFilter[item.AttributeType].checked) with (item.elTR = appendTag("tr", { className: (hisButtonId == "actueel" ? item.id : "") + " " + (AttributeTypeFilter[item.AttributeType] ? AttributeTypeFilter[item.AttributeType].filtertype || "" : "") })) {
				if (item.selected == 0) setAttribute('disabled', '');
				appendTag("td", { className: "symbol Value", attr: { value: row.Value || 0, [item.AttributeType]: row.Value || 0 } });
				appendTag("td", { className: "ModifiedDT", innerText: row.modifiedDT ? new Date(row.modifiedDT).toISOString().substr(0, 19).replace(/T/, ' ') : "" });

        for (var path = [], master = item; master && master.class != 'EquipmentModule'; master = master.master) {
          console.log(master.title, master);
          path.push(master.title);
        }
        // console.log(row);

				appendTag("td", { innerText: path.reverse().join('.') });
				var value = 'TextualValue' in row ? Number(row.TextualValue) : (!row.values || !row.values.Value ? '#' : row.Value);
				setAttribute('value', value || 0);
				var value = (item.Enum ? item.Enum.split(",")[value] : (isNaN(value) ? value : Math.round(value * 100) / 100)) || value;
				with (appendTag("td")) { appendTag("span", { className: "Value", innerText: value }); appendTag("span", { innerText: item.Unit || "" }); }
				appendTag("td", { innerText: item.Title || "" });
				appendTag("td", { innerText: item.AttributeType || "" });
			};
		});
	}
	gui.setTree();
}
setfilter = {
	select(checked, arr) { for (var attributeName in AttributeTypeFilter) if (arr.indexOf(AttributeTypeFilter[attributeName].filtertype) != -1) AttributeTypeFilter[attributeName].checked = checked; },
	actueel: function (selectedItem) {
		hisButtonId = "actueel";
		Aim.listData = [];
		(getItemAttributes = function (item) {
			if (item.schema == 'Device') return;
			if (item.schema == 'Attribute') Aim.listData.push(item);
			if (item.children) item.children.forEach(getItemAttributes);
		})(Aim.selectedItem = typeof selectedItem == 'object' ? selectedItem : Aim.selectedItem);
		writefilter();
	},
	history: function (filter) {
		Aim.load({
			src: "../../api/v1/acsm", get: { weblog: 1, filter: filter }, onload: function (event) {
				Aim.listData = [];
				event.data.forEach(function (row) {
					if (!row) return;
					var attribute = api.Attribute[row.id];
					if (!attribute) return;
					Aim.listData.push(Object.assign(row, { TextualValue: row.Value, Name: attribute.Name, Title: attribute.Title, Unit: attribute.Unit, Enum: attribute.Enum, StandardOutput: attribute.StandardOutput }));
				});
				writefilter();
			}
		});
	},
	uur1: function () { hisButtonId = "uur1"; setfilter.history("DATEDIFF(MINUTE, [LogDateTime], GETUTCDATE())<=60"); },
	uur4: function () { hisButtonId = "uur4"; setfilter.history("DATEDIFF(MINUTE, [LogDateTime], GETUTCDATE())<=240"); },
	uur24: function () { hisButtonId = "uur24"; setfilter.history("DATEDIFF(MINUTE, [LogDateTime], GETUTCDATE())<=1440"); },
	filter: function () {
		hisButtonId = "filter";
		var submit = function (event) {
			this.el.style.display = 'none';
			return false;
		};
		if (!this.el) with (this.el = document.body.appendTag('form', { className: 'popupform col', onsubmit: submit.bind(this) })) {
			with (appendTag('div', { className: 'row aco' })) {
				with (appendTag('div', { className: 'col aco' })) {
					appendTag('div', { innerText: 'Periode vanaf xxxxx:' });
					appendTag('div', { innerText: 'Selecteer datum:' });
					appendTag('input', {
						id: 'startDate', type: 'datetime-local', onchange: function () {
							//endDate.value = new Date(new Date(this.value).setDate(new Date(this.value).getDate() + 1)).toISOString().substr(0, 10);
						}
					});
				}
				with (appendTag('div', { className: 'col aco' })) {
					appendTag('div', { innerText: 'Periode Tot:' });
					appendTag('div', { innerText: 'Selecteer datum:' });
					appendTag('input', { id: 'endDate', type: 'datetime-local' });
				}
			}
			with (appendTag('div', { className: 'row' })) {
				appendTag('button', {
					innerText: 'OK', onclick: function () {
						setfilter.history("[LogDateTime]>='" + Aim.makeDateValue(startDate.value) + "' AND [LogDateTime]<'" + Aim.makeDateValue(endDate.value) + "'");
					}.bind(this)
				});
				appendTag('button', { innerText: 'Cancel', });
			}
			startDate.focus();
		}
		else {
			this.el.style.display = '';
			startDate.focus();
		}
	},
	alles: function (checked) {
		for (var attributeName in AttributeTypeFilter) AttributeTypeFilter[attributeName].checked = 1;
		alarm.setAttribute("checked", "");
		state.setAttribute("checked", "");
		measurement.setAttribute("checked", "");
	},
	alarm: function (checked) { setfilter.select(checked, ['alarm']); },
	state: function (checked) { setfilter.select(checked, ['state']); },
	measurement: function (checked) { setfilter.select(checked, ['measurement']); },
}

select = function (el) {
	if (el.name) for (var i = 0, e, c = el.parentElement.children; e = c[i]; i++) if (e.name == el.name) e.removeAttribute("checked");
	if (el.hasAttribute("checked")) el.removeAttribute("checked"); else el.setAttribute("checked", "");
	setfilter[el.id](el.hasAttribute("checked"));
	writefilter();
}
Aim.assign(gui = {
	client: {
		system: {
			id: Aim.appconfig.system.id,//3549983,
			uid: Aim.appconfig.system.uid,//"e90969be-b793-4bc1-9355-031f019fc297"
		}
	},
	deviceTopID: Aim.appconfig.device.id,//3563194,
	systemTopID: Aim.appconfig.system.id,//3549983,
	tree: {
		click: function () {
			for (var i = 0, e, c = folders.getElementsByTagName("div") ; e = c[i]; i++) e.removeAttribute("selected");
			this.setAttribute("selected", "");
			this.previousElementSibling.click();
			itemList = [];
			(recursive = function (item) {
				itemList.push(item.id); if (item.children) item.children.forEach(recursive);
			})(this.item);
			writefilter();
		}
	},
	client: {
		app: 'gui'
	},
	onload: function (event) {
		console.log('TOP', Aim, Aim.deviceTopID, Aim.api.item[Aim.deviceTopID]);
		folders.innerText = '';
		(writeNode = function (item, i) {
      console.log(item);
			if (item.schema == 'Attribute') return;
			if (item.schema == 'Device') return;
			with (item.elLI = this.appendTag('li', {})) {
				appendTag('ln');
				appendTag('open', { onclick: function () { this.setAttribute("open", this.open ^= 1); this.nextElementSibling.setAttribute("open", this.open); } });
				with (item.elDIV = appendTag('div', { className: item.id + ' symbol ', item: item, event: { click: gui.tree.click }, attr: { open: 0 } })) {
					appendTag('a', { name: item.id });
					if (item.detailID) appendTag('a', { innerText: item.title, href: "#" + item.detailID });
					else appendTag('span', { innerText: item.title });
				}
				if (item.children) {
					item.elChildren = appendTag('ul');
					item.children.forEach(writeNode.bind(item.elChildren));
				}
				else item.elDIV.setAttribute('open', 2);
			}
		}).call(folders.appendTag('ul'), api.item[Aim.systemTopID]);
		setfilter.actueel(api.item[Aim.systemTopID]);
		gui.setTree();
	},
	setTree: function () {
    acsmconnect.innerText = 'ACSM Status: ';
    var acmsHartbeat = Aim.api.item.filter(Boolean).find(item => item.name==='WATCHDOG_ACSM');
    if (acmsHartbeat) {
      acsmconnect.innerText += acmsHartbeat.values && acmsHartbeat.values.State && acmsHartbeat.values.State.value == 'connect' ? "Online" : "Offline";
    } else {
      acsmconnect.innerText += 'UNDEFINED';
    }
		Aim.api.Device.forEach(function (device, i) {
			if (!device.values || !device.values.State) return;
			var State = device.values.State.value;
			if (State == 'Connected') return; //MKA pleisetr, komt mee maar weet niet waarom.
			if (State == 'Disconnected') return; //MKA pleisetr, komt mee maar weet niet waarom.
			device.children.forEach(setState = function (child, i, children) {
				if (child.detailID) {
					(recursive = function (attribute) {
						attribute.State = State;
						attribute.children.forEach(recursive);
					})(items[child.detailID]);
				}
				child.children.forEach(setState);
			})
		});
		var treeAttributes = 'connect,connecting,error_read,disconnect,error,CriticalFailure,NonCriticalFailure,Warning'.split(',');
		for (var i = 0, el, c = folders.getElementsByTagName('DIV') ; el = c[i]; i++) treeAttributes.forEach(function (State) { el.removeAttribute(State); });
    console.log(Aim.api);
		Aim.api.Attribute.forEach(function (attribute) {
			if (attribute.elTR && attribute.elTR.parentElement) attribute.elTR.setAttribute('state', attribute.State);
			for (var parent = attribute; parent; parent = parent.master) {
				if (parent.elDIV) {
					parent.elDIV.setAttribute(attribute.State, Number(parent.elDIV.getAttribute(attribute.State)) + 1);
				}
			}
			var attributeType = AttributeTypeFilter[attribute.AttributeType];
			if (!attributeType) return;
			var stateAttributeName = attributeType.stateButton;
			if (!stateAttributeName) return;
			if (!attribute.Value == 1) return;
			for (var parent = attribute; parent; parent = parent.master) {
				if (parent.elDIV) {
					parent.elDIV.setAttribute(stateAttributeName, Number(parent.elDIV.getAttribute(stateAttributeName)) + 1);
				}
			}
		});
	},
	on: {
		disconnect: function (event) {
			Aim.disconnected = true;
		},
		connect: function (event) {
			console.log('CONNECT', event.data);
			var data = event.data;
			var value = event.data.value || [event.data];
			value.forEach(api.onload);
			Aim.onload();
		},
		message: function (event) {
      // console.log();
			if (event.data && event.data.value) gui.setTree();
		},
	},
});
setInterval(function (event) { elementTime.innerText = 'UTC time: ' + new Date().toISOString().substr(0, 19).replace(/T/, ' ') }, 1000);
