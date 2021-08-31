// Función con método fetch para generar el gráfico de acuerdo a
// la data de de la API obtenida por AJAX
const mostrarGrafico1 = () => {

    fetch('http://localhost:3000/api/total')
    .then( response => {
        return response.json();
    })
    .then( myJson => {
        let { data } = myJson;
        
        let masDe5m = data.filter(elemento => {
            return elemento.confirmed > 5000000;
        })

        let activos = [];
        masDe5m.forEach(elemento => {
            activos.push({y: elemento.confirmed, label: elemento.location});
            return activos;
        })
    
        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            title:{
                text: "Paises con Covid19"
            },
            axisY: {
                title: ""
            },
            data: [{        
                type: "column", 
                indexLabelPlacement: "outside",
                indexLabel: "{label}  {y}",
                indexLabelOrientation: "vertical",
                dataPoints: activos,
            },     
        ]
        });
        chart.render();
    })  
};

// Función con método fetch para generar la tabla de acuerdo a
// la data de de la API obtenida por AJAX
const mostrarTabla = () => {

    fetch('http://localhost:3000/api/total')
    .then( response => {
        return response.json()
    })
    .then ( myJson => {
        let { data } = myJson;

        let containerTabla = document.getElementById('container-tabla');

        let tabla1 ="<tr><th>Locación</th><th>Confirmados</th><th>Muertos</th><th>Recuperados</th><th>Activos</th><th>Detalle</th></tr>";

        for ( let i=0; i < data.length ; i++) {
            
            tabla1 += `
                        <tr>
                            <td>${data[i].location}</td>
                            <td>${data[i].confirmed}</td>
                            <td>${data[i].deaths}</td>
                            <td>${data[i].recovered}</td>
                            <td>${data[i].active}</td>
                            <td><button id='btn-toggle-modal${i}' type="button" class="btn btn-primary" data-pais=${data[i].location}> 
                            Ver detalle
                        </button></td>
                        </tr>
                        `;
        };
        containerTabla.innerHTML = tabla1;

        for ( let i=0; i < data.length ; i++){
            let boton = document.getElementById(`btn-toggle-modal${i}`);
        
            $(`#btn-toggle-modal${i}`).click( async ()=>{
                $("#modalDetalles").modal('show')
        
                pais = boton.dataset.pais;
    
                mostrarGrafico2(pais); 
            });
        }
    })
};

// Función con método fetch para generar el gráfico de detalles de 
// acuerdo a la data de de la API obtenida por AJAX
const mostrarGrafico2 = (country) => {
    fetch(`http://localhost:3000/api/countries/${country}`)
    .then( response => {
        return response.json()
    })
    .then ( myJson => {
        let { data } = myJson;

        var chart = new CanvasJS.Chart("chartContainer2", {
            animationEnabled: true,
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            title:{
                text: data.location
            },
            axisY: {
                title: ""
            },
            data: [{        
                type: "column", 
                indexLabelPlacement: "outside",
                indexLabel: "{y}",
                indexLabelOrientation: "horizontal",
                dataPoints: [
                    { y: data.confirmed, label: "Confirmados"},
                    { y: data.deaths, label: "Muertos"},
                    { y: data.recovered, label: "Recuperados"},
                    { y: data.active, label: "Activos"}
                    ],
            },     
        ]
        });
        chart.render();
    });
};

// Función IIFE para mostrar el gráfico y la tabla cuando se cargue
// la página index.js
const initSituacionMundial = ( async () => {
    mostrarGrafico1();
    mostrarTabla();
})();