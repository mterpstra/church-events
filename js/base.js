document.addEventListener("DOMContentLoaded", (event) => {
   const queryString = window.location.search;
   const urlParams = new URLSearchParams(queryString);
   const autoplay = urlParams.get("autoplay");
   const month = urlParams.get("month");
   const focusElement = document.getElementById("focus-event");

   focusElement.addEventListener('click', function(e) {
      focusElement.style.display = "none";
   });

   PopulateEventDatesArray();
   GenerateCalendar(month);

   setTimeout(function() {
      if (autoplay) {
         AutoPlay(focusElement);
      } else {
         ClickPlay(focusElement);
      }
   }, 1000) ;

});


// Converts a date object to a comparible string: YYYY-MM-DD  (no time).  
function GetComparableDate(input) {
   return input.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
   });
}

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
      parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]),
      parseInt(parts[3]), parseInt(parts[4]),   parseInt(parts[5]))
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

/* @todo: this should use a mustache template.. */
function AddEventsToDay(thisday, day) {
   for(var i=0; i < events.data.length; i++) {
      for (j=0; j < events.data[i].Event_Dates.length; j++) {

         const a = GetComparableDate(new Date(events.data[i].Event_Dates[j].Event_Start_Date));
         const b = GetComparableDate(thisday);

         if (a == b) {

            let element = document.createElement("div");
            element.classList.add("preview-event");
            const t = Render("templates/preview-event.tmpl", events.data[i], element);

            element.dataset.eventindex = i;
            element.dataset.eventdate = events.data[i].Event_Dates[j].Event_Start_Date;

            day.appendChild(element);
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
   const now = new Date();

   const container = document.getElementById("days-container");
   let today = new Date();
   if (month != null) {
      month = month-1;
      today = new Date(today.getFullYear(), month, 1);
   } 
   const first = new Date(today.getFullYear(), today.getMonth(), 1);
   document.getElementById("month-name").innerHTML = months[today.getMonth()];

   // Hmm, make sure this is correct...
   let counter = -1 * (first.getDay()-1);

   for(var i=0; i<WEEKS_IN_CALENDAR; i++) { 
      const week = document.createElement("div");
      week.classList.add("week");
      for(var j=0; j<7; j++) {
         const thisday = new Date(today.getFullYear(), today.getMonth(), counter);
         const day = document.createElement("div");
         day.classList.add("day");

         if (now.toDateString() == thisday.toDateString()) {
            day.classList.add("today");
         }

         // Maybe we don't want this...
         if (today.getMonth() != thisday.getMonth()) {
            day.classList.add("outside-the-month");
         }

         day.innerHTML = `<span>${thisday.getDate()}</span>`;
         AddEventsToDay(thisday, day);
         week.appendChild(day);
         counter++;
      }
      container.appendChild(week);
   }
}

function AutoPlay(focusElement) {
   focusElement.style.display = "block";
   const elements = document.querySelectorAll('.preview-event');
   SetFocusWithEvent(focusElement, elements[0]) ;
   let i=1;
   setInterval(function() {
      SetFocusWithEvent(focusElement, elements[i]) ;
      if (i < elements.length-1) {
         i++;
      } else {
         i=0;
      }
   }, 15000);
}

function AddQrCode(index, date) {
   console.log(window.location);
   setTimeout(function() {
      const element = document.getElementById('qrcode');
      element.innerHTML = null;
      const qrcode = new QRCode(element, {
         text: `${window.location.href}single_event.html?eventindex=${index}&eventdate=${date}`,
         width: 200,
         height: 200,
         colorDark : '#000',
         colorLight : '#fff',
         correctLevel : QRCode.CorrectLevel.H
      })
   }, 500);
}

function ClickPlay(focusElement) {
   const elements = document.querySelectorAll('.preview-event');
   elements.forEach(element => {
      element.addEventListener('click', function(e) {
         console.log("click");

         const index = element.dataset.eventindex; 
         const date =  element.dataset.eventdate;

         Render("templates/focus-event.tmpl", events.data[index], focusElement);
         focusElement.style.display = "block";
         focusElement.style.opacity = 1;

         AddQrCode(index, date);
      });
   });
}

function SetFocusWithEvent(focusElement, element ) {
   element.classList.add("next");
   setTimeout(function() {
      element.classList.remove("next");
   }, 2000);

   focusElement.classList.remove("active");

   const index = element.dataset.eventindex;
   const date  = element.dataset.eventdate;

   Render("templates/focus-event.tmpl", events.data[index], focusElement);
   AddQrCode(index, date);
   setTimeout(function() {
      focusElement.classList.add("active");
   }, 100);
}


