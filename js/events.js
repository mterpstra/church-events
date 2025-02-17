let events = {};
events.data = [];

const a = LoadEventsFromFile("data/imported-events.json");
const b = LoadEventsFromFile("data/manual-events.json");
const c = LoadEventsFromFile("data/imported-groups.json");

events.data = events.data.concat(a.data, b.data, ConvertGroupsToEvents(c));
console.log("total events", events);

function LoadEventsFromFile (file) {
   const request = new XMLHttpRequest();
   request.open("GET", file, false); 
   request.send(null);
   if (request.status === 200) {
      const json = JSON.parse(request.responseText);
      console.log("file events", file,  json);
      return json;
   }
   return null;
}


function ConvertGroupsToEvents(groups) {
   var events = [];
   console.log("Converting groups to events", groups);

   for (var i=0; i < groups.data.length; i++) {
      console.log(groups.data[i]);
      events[i] = {};
      events[i].Event_Start_Date = groups.data[i].Start_Date;
      events[i].Event_Title = groups.data[i].Group_Name;
      events[i].Primary_Contact = groups.data[i].Primary_Contact;
      events[i].Description = groups.data[i].Description;
   }

   console.log("Resulting events", events);
   return events;
}
