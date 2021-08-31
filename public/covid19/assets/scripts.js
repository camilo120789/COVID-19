// Evento click del botón que muestra el modal para iniciar sesión
$('#iniciar-sesion').click(() => {
    $("#modalIniciarSesion").modal('show');
});

// Evento click del botón del modal que inicia sesión, generando un JWT
// a partir de los datos del formulario con validaciones
$('#btn-aceptar').click(async () => {
    const correo = document.getElementById('js-input-email').value;
    const contraseña = document.getElementById('js-input-password').value;

    if ((correo === '') || (contraseña === '')) {
        alert('Debe llenar todos los campos del formulario');
    }
    else if ((contraseña != 'secret')) {
        alert('Contraseña incorrecta');
    }
    else {
        const JWT = await postData(correo, contraseña);

        toggleNavBar();

        $(".modal").modal('hide');
    }
});


// Evento click del link para cerrar sesión, muestra la opción para
// iniciar sesión, y oculta las opciones Situación Chile y Cerrar
// Sesión
$('#cerrar-sesion').click(() => {
    $('#iniciar-sesion').toggle();
    $('#situacion-chile').toggle();
    $('#cerrar-sesion').toggle();

    localStorage.clear();
    window.location.href = '/covid19/index.html';
});

// Toggle para el NavBar
const toggleNavBar = () => {
    $('#iniciar-sesion').toggle();
    $('#situacion-chile').toggle();
    $('#cerrar-sesion').toggle();
};

//--------------------------------------------
// Función asíncrona para generar el JWT
const postData = async (email, password) => {
    try {
        const response = await fetch('http://localhost:3000/api/login',
            {
                method: 'POST',
                body: JSON.stringify({ email: email, password: password })
            })
        const { token } = await response.json();
        localStorage.setItem('jwt-token', token);
        return token;
    }
    catch (err) {
        console.log(`Error: ${err}`);
    }
}

// Función IIFE para hacer mostrar las opciones Situacion Chile y
// Cerrar Sesión, y ocultar Iniciar Sesión, si existe un JWT
// almacenado en localStorage
const init = ((async = () => {
    const token = localStorage.getItem('jwt-token');

    if (token) {
        toggleNavBar();
    }
}))();