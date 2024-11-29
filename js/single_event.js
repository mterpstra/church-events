document.addEventListener("DOMContentLoaded", (event) => {

   console.log("document loaded");

   const queryString = window.location.search;
   const urlParams = new URLSearchParams(queryString);
   const cls = urlParams.get("class");
   const eventindex = parseInt(urlParams.get("eventindex"));
   const eventdate  = urlParams.get("eventdate");

   const target = document.getElementById("target");
   target.classList.add(cls);

   const data = events.data[eventindex]; 
   data["eventdate"] = eventdate; 

   console.log("here");
   alert("here");

   if (cls == "focus-event") {
      Render("templates/focus-event.tmpl", data, "target");
      const focusElement = document.getElementById("target");
      focusElement.style.display = "block";
      focusElement.style.opacity = 1;
   } else {
      Render("templates/single-event.tmpl", data, "target");
   }

});
