document.addEventListener("DOMContentLoaded", (event) => {
   const queryString = window.location.search;
   const urlParams = new URLSearchParams(queryString);
   const autoplay = urlParams.get("autoplay");
   const month = urlParams.get("month");
   console.log("month", month);
   const focusElement = document.getElementById("focus-event");

   focusElement.addEventListener('click', function(e) {
      focusElement.style.display = "none";
   });

   PopulateEventDatesArray();
   GenerateCalendar(month);

   if (autoplay) {
      AutoPlay(focusElement);
   } else {
      ClickPlay(focusElement);
   }
});

// Returns a valid date object.  Despite leading zeros.
function ParseDate(input) {
   let temp = input;
   temp = temp.replaceAll("T", "-");
   temp = temp .replaceAll(":", "-");
   let parts = temp.split("-");
   if (parts.length != 6) {
      console.log("Invalid Date", input);
      return null;
   }
   return new Date( 
      parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2]),
      parseInt(parts[3]), parseInt(parts[4]), parseInt(parts[5]))
}

function GetDisplayDate(dateString) {
   let date = ParseDate(dateString);
   let hours = date.getHours();
   const amPm = hours >= 12 ? 'PM' : 'AM';
   hours = hours % 12;
   hours = hours ? hours : 12; // If hours is 0, set it to 12
   const minutes = date.getMinutes();
   const timeString = `${date.toDateString()} ${hours}:${minutes.toString().padStart(2, '0')} ${amPm}`;
   return timeString;
}

// Makes sure all events have a "Event_Dates" array.
function PopulateEventDatesArray() {
   for(var i=0; i < events.data.length; i++) {
      if (events.data[i].Event_Dates == null) {
         events.data[i].Event_Dates = [];
         events.data[i].Event_Dates.push({
            "Event_Start_Date": events.data[i].Event_Start_Date,
            "Event_End_Date": events.data[i].Event_End_Date
         });
      }
   }
}

// Look in the events and add them to the day
function AddEventsToDay(thisday, day) {
   for(var i=0; i < events.data.length; i++) {
      for (j=0; j < events.data[i].Event_Dates.length; j++) {
         const index = events.data[i].Event_Dates[j].Event_Start_Date.indexOf("T");
         const start = events.data[i].Event_Dates[j].Event_Start_Date.substr(0,index);
         const testing = `${thisday.getFullYear()}-${thisday.getMonth()+1}-${thisday.getDate()}`

         if (testing == start) {

            let event = document.createElement("div");
            event.classList.add("event");
            event.dataset.eventindex = i;
            event.dataset.eventdate = events.data[i].Event_Dates[j].Event_Start_Date;

            let title = document.createElement("div");
            title.classList.add("title");
            title.innerHTML = events.data[i].Event_Title;

            event.appendChild(title);
            day.appendChild(event);
         }
      }
   }
}

function GenerateCalendar(month) {

   const months = [
      "January", "February", "March", "April", 
      "May", "June", "July", "August", 
      "September", "October", "November", "December"];

   const WEEKS_IN_CALENDAR = 5;

   const container = document.getElementById("days-container");
   let today = new Date();
   if (month != null) {
      month = month-1;
      today = new Date(today.getFullYear(), month, 1);
   } 
   console.log("month", month, "today", today);
   const first = new Date(today.getFullYear(), today.getMonth(), 1);

   document.getElementById("month").innerHTML = months[today.getMonth()];

   // Hmm, make sure this is correct...
   let counter = -1 * (first.getDay()-1);

   for(var i=0; i<WEEKS_IN_CALENDAR; i++) { 
      const week = document.createElement("div");
      week.classList.add("week");
      for(var j=0; j<7; j++) {
         const thisday = new Date(today.getFullYear(), today.getMonth(), counter);
         const day = document.createElement("div");
         day.classList.add("day");

         // Maybe we don't want this...
         if (today.getMonth() != thisday.getMonth()) {
            day.classList.add("outside-the-month");
         }

         day.innerHTML = thisday.getDate();
         AddEventsToDay(thisday, day);
         week.appendChild(day);
         counter++;
      }
      container.appendChild(week);
   }
}

function AutoPlay(focusElement) {
   focusElement.style.display = "block";
   const elements = document.querySelectorAll('.event');
   let i=0;
   setInterval(function() {
      SetFocusWithEvent(focusElement, elements[i]) ;
      if (i < elements.length-1) {
         i++;
      } else {
         i=0;
      }
   }, 15000);
}

function GetHtmlForEvent(index, eventdate) {

   let event = document.createElement("div");
   const str = events.data[index].Event_Title.replaceAll(' ', '-').toLowerCase();
   event.classList.add("event");
   event.classList.add(str);

   let title = document.createElement("div");
   title.classList.add("title");
   title.innerHTML = events.data[index].Event_Title;

   let graphic = document.createElement("div");
   let img = document.createElement("img");
   img.src = events.data[index].Graphic_URL;
   graphic.classList.add("graphic");
   graphic.appendChild(img);

   let description = document.createElement("div");
   description.classList.add("description");
   description.innerHTML = events.data[index].Description;

   let contact = document.createElement("div");
   contact.classList.add("contact");
   contact.innerHTML = events.data[index].Primary_Contact.Display_Name;

   let location = document.createElement("div");
   location.classList.add("location");
   location.innerHTML = events.data[index].Location.Location_Name;

   let date = document.createElement("div");
   date.classList.add("date");
   date.innerHTML = GetDisplayDate(eventdate);

   let details = document.createElement("div");
   details.classList.add("details");

   details.appendChild(description);
   details.appendChild(location);
   details.appendChild(contact);
   details.appendChild(date);

   event.appendChild(title);
   event.appendChild(graphic);
   event.appendChild(details);

   return event;
}

function ClickPlay(focusElement) {
   const elements = document.querySelectorAll('.event');
   elements.forEach(element => {
      element.addEventListener('click', function(e) {
         focusElement.style.display = "block";
         focusElement.style.opacity = 1;
         focusElement.innerHTML = null;
         focusElement.appendChild(GetHtmlForEvent(element.dataset.eventindex, element.dataset.eventdate));
      });
   });
}

function SetFocusWithEvent(focusElement, element ) {
   focusElement.classList.remove("active");
   focusElement.innerHTML = null;
   focusElement.appendChild(GetHtmlForEvent(element.dataset.eventindex, element.dataset.eventdate));
   setTimeout(function() {
      focusElement.classList.add("active");
   }, 100);
}
