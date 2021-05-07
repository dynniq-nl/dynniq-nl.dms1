/**
* @file DMS aanvulling AIM node Event Manager
* @version 1.0.1
* @version 1.0.2
* @version 1.0.3
* function x aangepast
* @author Max van Kampen (max.van.kampen@alicon.nl)
*/
var Aim = require('/aim/www/aim/v1/node');

var em = {
  acsm: {},
  acsmCount: 0,
  alarms: [],
  alarmNames: { CriticalFailure: {}, NonCriticalFailure: {}, Locking: {}, Maintenance: {}, Running: {}, RunningMode: {}, Security: {}, PreWarning_1: {}, PreWarning_2: {}, PreWarning_3: {}, PreWarning_4: {}, PreWarning_5: {}, PreWarning_6: {}, PreWarning_7: {}, MeasurementErrorFlag: {}, },
  logNames: { CriticalFailure: {}, NonCriticalFailure: {}, Locking: {}, Maintenance: {}, Running: {}, RunningMode: {}, Security: {}, PreWarning_1: {}, PreWarning_2: {}, PreWarning_3: {}, PreWarning_4: {}, PreWarning_5: {}, PreWarning_6: {},  PreWarning_7: {}, MeasurementErrorFlag: {}, Measurement_1: {}, Measurement_2: {}, Measurement_3: {}, Measurement_4: {}, Measurement_5: {}, Measurement_6: {} },
  WebLogItemArray: [],
  AcsmUpload: function (WebLogItem) {
    clearTimeout(em.AcsmUploadTimeout);
    if (WebLogItem) {
      em.WebLogItemArray.push(WebLogItem);
      em.AcsmUploadTimeout = setTimeout(em.AcsmUpload, 100);
      return;
    }
    Aim.load({
      protocol: 'http', options: { host: 'localhost', port: 80, path: '/sites/dms1/api/v1/acsm/index.php?weblog', method: 'put' }, input: { WebLogItemArray: em.WebLogItemArray }, onload: function (event) {
        var State = this.data.Active ? 'connect' : 'disconnect';
        //console.log('UPLOAD ACSM', this.data);
        Aim.setState(Aim.items[Aim.config.acmsHartbeatID], State);
        //if (em.acsm.Active != this.data.Active) {
        //	em.acsm.Active = this.data.Active;
        //	Aim.setState(Aim.items[Aim.config.acmsHartbeatID], em.acsm.Active ? 'connect' : 'disconnect');
        //}
      }
    });
    em.WebLogItemArray = [];
  }
};

/**
* Verstuur een attribute change naar het ACSM
* @option Maak een verzamelmelding per StandaardOutput en stuur deze naar ACSM. Letop Een attribute kan onder een attribute liggen dus loop omhoog tot een systems instance. Bepaald onder een systeminstance van alle kinderen en kind-kinderen of er eenzelfde alarm actief is. Verstuur alleen een wijziging. Dit geld voor alarmNames
* @author Max van Kampen (max.van.kampen@alicon.nl)
* @global
* @event On change of list of attributes
* @param {string} somebody - lfkjhas djk falksjdhf jashdfa
* @version 1.0.3
*/
Aim.attributes.on('change', (value) => {
  //Aim.log('change',value);
  value.forEach(function (row) {
    var item = Aim.items[row.id];
    if (row.values) for (var attributeName in row.values) {
      var value = row.values[attributeName].value;
      //get dms_System-instance
      var system_instance = item;
      while (system_instance && system_instance.class != 'ControlModule') system_instance = Aim.items[system_instance.masterID];
      if (!system_instance) return;
      //bepaald system attribute type's via kinderen
      var sumattributes = {};
      system_instance.children.forEach(recursive = function (item) {
        if (em.logNames[item.AttributeType]) sumattributes[item.AttributeType] = sumattributes[item.AttributeType] || item.Value;
        item.children.forEach(recursive);
      });
      //verstuur gewijzigde attribute types
      //var LogTypeArray = { dms_Location: "LocationSO_", dms_Group: "GroupSO_", dms_System: "SystemInstanceSO_" };
      //var WebLogItem = {
      //	SystemInstanceID: 0, GroupID: 0, LocationID: 0, TagID: 0,
      //	LogType: String((LogTypeArray[item.class] || "") + (attributeName || "")).toLowerCase(),
      //	TextualValue: value,
      //	NumericValue: isNaN(value) ? "" : value,
      //	Quality: item.Quality || "",
      //	StandardOutput: String(attributeName || "").toLowerCase(),
      //}
      for (var parent = Aim.items[system_instance.masterID]; parent; parent = Aim.items[parent.masterID]) {
        if (parent.class == 'dms_Group') system_instance.GroupID = system_instance.GroupID || parent.id;
        else if (parent.class == 'dms_Location') system_instance.LocationID = system_instance.LocationID || parent.id;
      }
      for (var attributeName in sumattributes) if (sumattributes[attributeName] != system_instance[attributeName]) {
        //console.log('em.AcsmUpload', attributeName, sumattributes[attributeName], system_instance[attributeName]);
        em.AcsmUpload({
          SystemInstanceID: system_instance.id,
          StandardOutput: String(attributeName).toLowerCase(),
          TextualValue: system_instance[attributeName] = sumattributes[attributeName],
          LocationID: system_instance.LocationID,
          GroupID: system_instance.GroupID,
          TagID: 0,
          LogType: "",//String((LogTypeArray[item.class] || "") + (attributeName || "")).toLowerCase(),
          NumericValue: "",//isNaN(value) ? "" : value,
          Quality: "Valid",
        });

      }

      //if (['Measurement_1', 'Measurement_2', 'Measurement_3', 'Measurement_4', 'Measurement_5'].indexOf(item.AttributeType) != -1) {
      //	setAttribute(item, item.AttributeType, newvalue);
      //}

      //if (!em.logNames[attributeName]) return;
      //var idname = { dms_Location: "LocationID", dms_Group: "GroupID", dms_System: "SystemInstanceID", Attribute: "TagID" };
      //if (idname[item.class]) WebLogItem[idname[item.class]] = item.id;
      //em.AcsmUpload(WebLogItem);
    }
  })

});

setInterval(function () {
  if (em.acsmCount >= Aim.config.acmsHartbeatMaxCount) em.acsmCount = 1; else em.acsmCount++;
  Aim.setAttribute(Aim.items[Aim.config.acmsHartbeatID], 'Value', em.acsmCount);
  //em.AcsmUpload({ SystemInstanceID: 344, GroupID: 0, LocationID: 0, TagID: 0, LogType: "", TextualValue: "", NumericValue: em.acsmCount, Quality: "", StandardOutput: "Measurement_3", });
  em.AcsmUpload({ SystemInstanceID: 344, StandardOutput: "Measurement_3", TextualValue: em.acsmCount });
}, Aim.config.acmsHartbeatTimeout);
