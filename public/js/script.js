// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

  
    // const map = new maplibregl.Map({
    //     container: 'map', // HTML container id
    //     style: 'https://api.maptiler.com/maps/basic/style.json?key=nyOSze9lvdAFT2nRxfuL', // Map style
    //     center: [77.2090, 28.6139], // Coordinates [longitude, latitude]
    //     zoom: 12 // Initial zoom level
    // });

//     // Add a marker (optional)
//     new maplibregl.Marker()
//         .setLngLat([77.2090, 28.6139])
//         .setPopup(new maplibregl.Popup().setHTML('<h3>New Delhi</h3><p>Capital of India</p>')) // Optional: Add a popup
//         .addTo(map);


// const geojson = {
//     "type": "Feature",
//     "geometry": {
//         "type": "Point",
//         "coordinates": [77.2090, 28.6139]
//     },
//     "properties": {
//         "title": "New Delhi",
//         "description": "Capital of India"
//     }
// };

// new maplibregl.Marker()
//     .setLngLat(geojson.geometry.coordinates)
//     .setPopup(
//         new maplibregl.Popup({ offset: 25 }) // add popups
//         .setHTML(`<h3>${geojson.properties.title}</h3><p>${geojson.properties.description}</p>`)
//     )
//     .addTo(map);