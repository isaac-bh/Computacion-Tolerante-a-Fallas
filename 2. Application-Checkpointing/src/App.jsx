import { useEffect, useState } from 'react'

function App() {
    // Estado inicial del formulario
    const [datos, setDatos] = useState({
        nombre: '',
        apellidos: '',
        email: '',
        curp: '',
        fechaN: '',
    });

    // Se guarda en el estado del formulario el valor ingresado
    // y se guarda en localStorage para poder recuperarlo despues
    // aqui se realiza el checkpoint cada vez que alguien escriba
    const handleChange = (event) => {
        event.preventDefault();
        setDatos({
            ...datos,
            [event.target.name]: event.target.value
        });
        localStorage.setItem(event.target.name, event.target.value);
    }
    
    // Evento de enviar, como no conecto a BD solo limpio todo.
    const handleSubmit = (event) => {
        event.preventDefault();
        setDatos({
            nombre: '',
            apellidos: '',
            email: '',
            curp: '',
            fechaN: '',
        });
        localStorage.clear();
    }

    // Se recupera la información del checkpoint anterior, esta
    // funcion se invoca una sola vez cuando se carga el componente
    useEffect(() => {
        setDatos({
            nombre: localStorage.getItem("nombre"),
            apellidos: localStorage.getItem("apellidos"),
            mail: localStorage.getItem("mail"),
            curp: localStorage.getItem("curp"),
            fechaN: localStorage.getItem("fechaN"),
        });
    }, [])

    return (
        <div className='bg-gray-200 w-screen h-screen cucei'>
            <div className='form w-2/5 h-1/2 bg-gray-500 px-4 py-2 m-auto inline-block absolute top-0 left-0 right-0 bottom-0'>
                <form onSubmit={handleSubmit}>
                    <div className='flex justify-between my-2 h-8 text-white'>
                        <p className='w-1/2 mr-2'>Nombre:</p>
                        <p className='w-1/2 ml-2'>Apellidos:</p>
                    </div>
                    <div className='flex justify-between my-2 h-8 font-light'>
                        <input 
                            type="text" 
                            name="nombre" 
                            id="nombre" 
                            placeholder="Juan..." 
                            className='w-1/2 mr-2' 
                            onChange={handleChange} 
                            value={datos.nombre || ''}
                        />
                        <input 
                            type="text" 
                            name="apellidos" 
                            id="apellidos" 
                            placeholder="Perez..." 
                            className='w-1/2 ml-2'
                            onChange={handleChange} 
                            value={datos.apellidos || ''}
                        />
                    </div>
                    <p className='w-1/2 mr-2 text-white'>Email:</p>
                    <input 
                        type="email" 
                        name="mail" 
                        id="mail" 
                        placeholder='ejemplo@mail.com' 
                        className='w-full my-2 h-8'
                        onChange={handleChange}
                        value={datos.mail || ''}
                    />
                    <p className='w-1/2 mr-2 text-white'>CURP:</p>
                    <input 
                        type="text" 
                        name="curp" 
                        id="curp" 
                        placeholder='XXXX######XXXXXXX#' 
                        className='w-full my-2 h-8'
                        onChange={handleChange}
                        value={datos.curp || ''}
                    />
                    <p className='text-white'>Ingresa tu fecha de nacimiento:</p>
                    <input 
                        type="text" 
                        name="fechaN" 
                        id="fechaN" 
                        className='w-full my-2 h-8'
                        placeholder='DD/MM/YYYY'
                        onChange={handleChange}
                        onFocus={(e) => e.target.type = 'date'}
                        value={datos.fechaN || ''}
                    />

                    <button className='bg-blue-500 p-2 rounded-full w-1/3 text-white font-semibold block my-2 mx-auto'>Enviar</button>
                </form>

            </div>

            <div className='absolute bottom-0 right-0 text-right text-gray-400 m-2'>
                Benavides Hernandez Isaac Alain<br></br>
                Application Checkpointing - Computación Tolerante a Fallas
            </div>
        </div>
    )
}

export default App
