let events = {};
events.data = [];
const a = LoadEventsFromFile("data/imported-events.json");
const b = LoadEventsFromFile("data/manual-events.json");
events.data = a.data.concat(b.data);
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
