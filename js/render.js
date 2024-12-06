function Render(file, data, id) {
   fetch(file)
      .then(function (response) {
         return response.text();
      })
      .then(function (template) {
         const rendered = Mustache.render(template, data);

         if (typeof id == "string") {
            const target = document.getElementById(id);
            target.innerHTML = rendered;
         }

         if (typeof id == "object") {
            id.innerHTML = rendered;
         }
      });
}
