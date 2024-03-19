import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { alertaSuccess, alertaError, alertaWarning, alertaConfirmation } from '../functions';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const ShowProductos = () => {
    const url = 'https://api.escuelajs.co/api/v1/products';
    const [products, setProducts] = useState([]);
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [titleModal, setTitleModal] = useState('');
    const [operation, setOperation] = useState(1);

    const getProductos = async () => {
        const response = await axios.get(url);
        setProducts(response.data);
    }

    useEffect( () => {
        getProductos();
    });

    const openModal = (operation, id, title, description, price) => {
        setId('');
        setTitle('');
        setDescription('');
        setPrice('');

        if (operation === 1) {
            setTitleModal('Registrar Producto');
            setOperation(1);
        } else if (operation === 2) {
            setTitleModal('Editar Producto');
            setId(id);
            setTitle(title);
            setDescription(description);
            setPrice(price);
            setOperation(2);
        }
    }

    const enviarSolicitud = async (url, metodo, parametros) => {
        let obj = {
            method: metodo,
            url: url,
            data: parametros,
            headers: {
                "Content-Type":"application/json",
                "Accept":"application/json"
            }
        };
        await axios(obj).then( () => {
            let mensaje;

            if (metodo === 'POST') {
                mensaje = 'Se guardó el producto';
            } else if (metodo === 'PUT') {
                mensaje = 'Se editó el producto';
            } else if (metodo === 'DELETE') {
                mensaje = 'Se eliminó el producto';
            }
            alertaSuccess(mensaje);
            document.getElementById('btnCerrarModal').click();
            getProductos();
        }).catch((error) => {
            alertaError(error.response.data.message);
            console.log(error);
        });
    }

    const validar = () => {
        let payload;
        let metodo;
        let urlAxios;

        if (title === '') {
            alertaWarning('Escriba el nombre del producto', 'title');
        } else if (description === '') {
            alertaWarning('Escriba la descripción del producto', 'description');
        } else if (price === '') {
            alertaWarning('Escriba el precio del producto', 'price');
        } else {
            payload = {
                title: title,
                description: description,
                price: price,
                categoryId: 6,
                images: ['https://c8.alamy.com/compes/r3yw81/el-icono-de-imagen-no-disponible-vector-plana-r3yw81.jpg']
            };

            if (operation === 1) {
                metodo = 'POST';
                urlAxios = 'https://api.escuelajs.co/api/v1/products/';
            } else {
                metodo = 'PUT';
                urlAxios = `https://api.escuelajs.co/api/v1/products/${id}`;
            }

            enviarSolicitud(urlAxios, metodo, payload);
        }
    }

    const deleteProducto = (id) => {
        let urlDelete = `https://api.escuelajs.co/api/v1/products/${id}`;

        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: '¿Está seguro de eliminar el producto?',
            icon: 'question',
            text: 'No habrá marcha atrás',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setId(id);
                enviarSolicitud(urlDelete, 'DELETE', {});
            }
        }).catch((error) => {
            alertaError(error);
            console.log(error);
        });
    }

 return (
    <div className='App'>
        <div className='container-fluid'>
            <div className='rwo mt-3'>
                <div className='col-md-4 offset-md-4'>
                    <div className='d-grid mx-auto'>
                        <button onClick={() => openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                            <i className='fa-solid fa-circle-plus' /> Añadir
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div className='row mt-3'>
            <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                <div className='table-responsive'>
                    <table className='table table-bordered'>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Producto</th>
                                <th>Descripción</th>
                                <th>Categoría</th>
                                <th>Precio</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className='table-group-divider'>
                            {
                                products.map( (product, i) => (
                                    <tr key={product.id}>
                                        <td>{i + 1}</td>
                                        <td>{product.title}</td>
                                        <td>{product.description}</td>
                                        <td>{product.category.name}</td>
                                        <td>${new Intl.NumberFormat('es-hn').format(product.price)}</td>
                                        <td>
                                            <button onClick={() => openModal(2, product.id, product.title, product.description, product.price)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                                                <i className='fa-solid fa-edit' />
                                            </button>
                                            <button onClick={() => deleteProducto(product.id)} className='btn btn-danger'>
                                                <i className='fa-solid fa-trash' />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div id='modalProducts' className='modal fade' aria-hidden='true'>
            <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <label className='h5'>{titleModal}</label>
                        <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='cloase' />
                    </div>
                    <div className='modal-body'>
                        <input type='hidden' id='id' />
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-gift' /></span>
                            <input type='text' id='title' className='form-control' placeholder='Nombre' value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-comment' /></span>
                            <input type='text' id='description' className='form-control' placeholder='Descripción' value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-dollar-sign' /></span>
                            <input type='text' id='price' className='form-control' placeholder='Precio' value={price} onChange={(e) => setPrice(e.target.value)} />
                        </div>
                    </div>
                    <div className='modal-footer'>
                        <button onClick={() => validar()} className='btn btn-success'>
                            <i className='fa-solid fa-floppy-disk' /> Guardar
                        </button>
                        <button id='btnCerrarModal' className='btn btn-secondary' data-bs-dismiss='modal'>
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ShowProductos;
