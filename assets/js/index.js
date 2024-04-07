const api_url = 'https://mindicador.cl/api/'
const callForm = document.getElementById("form");
let myCanvaChart = null;


callForm.addEventListener("submit", function (e) {
    e.preventDefault();
     conversion();
     cargarGrafico();
  });

const callApi = async () => {
    try {
    const response = await fetch(api_url);
    const data = await response.json();


    const uniMedidaPesos = Object.keys(data).filter(
        (element) => data[element]["unidad_medida"] === "Pesos"
      );
    const monedasCambio = uniMedidaPesos.map(moneda => ({
        codigo: data[moneda]['codigo'],
        nombre: data[moneda]['nombre'],
        valor: data[moneda]['valor']
    }))

    const opcionesSelect = document.querySelector('#select-monedas')
    monedasCambio.forEach(moneda => {
        opcionesSelect.innerHTML += `
            <option value="${moneda.codigo}">${moneda.nombre}</option>
        `
    })

    } catch (error) {
        console.log(error)
    }
    };

const getCoindata = async (currency) => {
    const response = await fetch(`${api_url}${currency}`);
    const data = await response.json();
    const datosFiltrados = data.serie.splice(0, 10);
    return datosFiltrados;
    };
    

const conversion = async () => {
    try {
      const amount = document.getElementById("valor-pesos").value;
      const montoSelect = document.getElementById("select-monedas").value;
      const data = await getCoindata(montoSelect);
      const montoSelectValue = data[0].valor;
      const result = amount / montoSelectValue;
  
      document.getElementById("resultado").innerText = `Resultado: $${result.toFixed(
        2
      )} ${montoSelect.toUpperCase()}`;
    } catch (error) {
      console.log(error);
      document.getElementById("resultado").innerText = `Error: ${error.message}`;
    }
  }

  const cargarGrafico = async () => {
    let loading;
    try {
      loading = document.getElementById("loading");
      loading.innerText = "Cargando...";
      loading.style.display = "block";
  
      const currency = document.getElementById("select-monedas").value;
  
      if (myCanvaChart) myCanvaChart.destroy();
  
      const datosFechas = await getCoindata(currency);
  
      const labels = datosFechas.map((element) => new Date(element.fecha).toLocaleDateString("es-CL"));
      const data = datosFechas.map((element) => element.valor);
      const datasets = [
        {
          label: currency,
          borderColor: "rgb(255, 255, 255)",
          data,
        },
      ];
      const data_render = { labels, datasets };
      configGrafico(data_render);
  
      setTimeout(() => {
        loading.style.display = "none";
        loading.innerText = "";
      }, 1000);
  
    } catch (error) {
      document.getElementById("resultado").innerText = "Error: Debes elegir una tipo de moneda válido";
      setTimeout(() => {
        loading.style.display = "none";
        loading.innerText = "";
      }, 1000);
    }
  }
  
  
  
  
  const configGrafico = (data) => {
    const config = {
      type: "line",
      data,
      options: {
        plugins: {
          legend: {
            labels: {
              color: "white",
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: "white",
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
          y: {
            ticks: {
              color: "white",
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
        },
      },
    };
    const myChart = document.getElementById("myChart");
    myChart.style.backgroundColor = "#D75858";
    myCanvaChart = new Chart(myChart, config);
  };

callApi()